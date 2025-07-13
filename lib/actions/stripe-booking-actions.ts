"use server"

import { createServerClient } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"
import { sendBookingConfirmation } from "@/lib/services/resend-service"

export async function createStripeBooking(formData: FormData) {
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
    stripe_subscription_id: formData.get("stripe_subscription_id") as string,
    stripe_customer_id: formData.get("stripe_customer_id") as string,
    is_subscription: formData.get("is_subscription") === "true",
  }

  // Validate required fields
  if (!bookingData.house_size || !bookingData.scheduled_date || !bookingData.scheduled_time || !bookingData.address) {
    throw new Error("Missing required booking information")
  }

  try {
    // Create booking
    const { data: booking, error } = await supabase.from("bookings").insert(bookingData).select().single()

    if (error) throw error

    // Create subscription record if it's a subscription
    if (bookingData.is_subscription && bookingData.stripe_subscription_id) {
      const subscriptionData = {
        user_id: user.id,
        stripe_subscription_id: bookingData.stripe_subscription_id,
        stripe_customer_id: bookingData.stripe_customer_id,
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
        is_subscription: bookingData.is_subscription,
        frequency: bookingData.frequency,
      })
    }

    revalidatePath("/dashboard")
    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("Error creating Stripe booking:", error)
    throw new Error("Failed to create booking")
  }
}

export async function cancelStripeSubscription(subscriptionId: string) {
  const supabase = createServerClient()

  try {
    // Cancel subscription in Stripe
    const response = await fetch("/api/stripe/cancel-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    })

    if (!response.ok) {
      throw new Error("Failed to cancel Stripe subscription")
    }

    // Update subscription status in database
    await supabase.from("subscriptions").update({ status: "cancelled" }).eq("stripe_subscription_id", subscriptionId)

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    throw new Error("Failed to cancel subscription")
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
