"use server"

import { createServerClient } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"
import { sendBookingConfirmation, sendQuoteRequestNotification } from "@/lib/services/resend-service"

export async function createHouseCleaningBooking(formData: FormData) {
  const supabase = createServerClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Extract booking data
  const bookingData = {
    user_id: user.id,
    service_id: "house-cleaning",
    house_size: formData.get("house_size") as string,
    frequency: formData.get("frequency") as string,
    add_ons: JSON.parse((formData.get("add_ons") as string) || "[]"),
    scheduled_date: formData.get("scheduled_date") as string,
    scheduled_time: formData.get("scheduled_time") as string,
    address: formData.get("address") as string,
    special_instructions: formData.get("special_instructions") as string,
    base_price: Number.parseFloat(formData.get("base_price") as string),
    final_price: Number.parseFloat(formData.get("final_price") as string),
    status: "confirmed",
    payment_status: "paid",
    stripe_payment_id: formData.get("stripe_payment_id") as string,
  }

  // Validate required fields
  if (!bookingData.house_size || !bookingData.scheduled_date || !bookingData.scheduled_time || !bookingData.address) {
    throw new Error("Missing required booking information")
  }

  try {
    // Create booking
    const { data: booking, error } = await supabase.from("bookings").insert(bookingData).select().single()

    if (error) throw error

    // Create subscription if frequency is not one-time
    if (bookingData.frequency !== "one-time") {
      const subscriptionData = {
        user_id: user.id,
        plan_type: `House Cleaning - ${bookingData.frequency}`,
        status: "active",
        monthly_price: bookingData.final_price,
        next_billing_date: getNextBillingDate(bookingData.frequency),
        services_included: ["house-cleaning"],
        discount_percentage: getDiscountPercentage(bookingData.frequency),
        booking_id: booking.id,
      }

      await supabase.from("subscriptions").insert(subscriptionData)
    }

    // Find and assign provider
    const { data: providers } = await supabase
      .from("providers")
      .select("*")
      .eq("active", true)
      .contains("services", ["house-cleaning"])
      .limit(1)

    if (providers && providers.length > 0) {
      const assignedProvider = providers[0]

      await supabase.from("bookings").update({ provider_id: assignedProvider.id }).eq("id", booking.id)

      // Create tracking record
      await supabase.from("tracking").insert({
        booking_id: booking.id,
        provider_id: assignedProvider.id,
        status: "assigned",
        notes: "Provider assigned to house cleaning booking",
      })
    }

    // Send confirmation email
    if (user.email) {
      await sendBookingConfirmation(user.email, {
        ...booking,
        service_title: "House Cleaning",
        customer_name: formData.get("customer_name") as string,
      })
    }

    revalidatePath("/dashboard")
    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("Error creating house cleaning booking:", error)
    throw new Error("Failed to create booking")
  }
}

export async function createQuoteRequest(formData: FormData) {
  const supabase = createServerClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Extract quote request data
  const quoteData = {
    user_id: user.id,
    service_type: formData.get("service_type") as string,
    description: formData.get("project_details") as string,
    address: formData.get("address") as string,
    property_type: formData.get("property_type") as string,
    property_size: formData.get("property_size") as string,
    preferred_date: formData.get("preferred_date") as string,
    preferred_time: formData.get("preferred_time") as string,
    urgency: formData.get("urgency") as string,
    estimated_budget: formData.get("estimated_budget") as string,
    photos: JSON.parse((formData.get("photos") as string) || "[]"),
    status: "pending",
  }

  // Validate required fields
  if (!quoteData.service_type || !quoteData.description || !quoteData.address || !quoteData.preferred_date) {
    throw new Error("Missing required quote request information")
  }

  try {
    // Create quote request
    const { data: quoteRequest, error } = await supabase.from("quote_requests").insert(quoteData).select().single()

    if (error) throw error

    // Send notification email to admin
    await sendQuoteRequestNotification({
      name: formData.get("customer_name") as string,
      email: user.email!,
      phone: formData.get("customer_phone") as string,
      service: quoteData.service_type,
      property_type: quoteData.property_type,
      property_size: quoteData.property_size,
      urgency: quoteData.urgency,
      description: quoteData.description,
    })

    revalidatePath("/dashboard")
    return { success: true, requestId: quoteRequest.id }
  } catch (error) {
    console.error("Error creating quote request:", error)
    throw new Error("Failed to create quote request")
  }
}

function getNextBillingDate(frequency: string): string {
  const now = new Date()
  switch (frequency) {
    case "weekly":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    case "biweekly":
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    case "monthly":
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    default:
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  }
}

function getDiscountPercentage(frequency: string): number {
  switch (frequency) {
    case "weekly":
      return 33
    case "biweekly":
      return 27
    case "monthly":
      return 20
    default:
      return 0
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId)

    if (error) throw error

    // Update tracking
    await supabase.from("tracking").insert({
      booking_id: bookingId,
      status,
      notes: `Booking status updated to ${status}`,
    })

    revalidatePath("/dashboard")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error updating booking status:", error)
    throw new Error("Failed to update booking status")
  }
}

export async function cancelBooking(bookingId: string) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId)

    if (error) throw error

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    throw new Error("Failed to cancel booking")
  }
}
