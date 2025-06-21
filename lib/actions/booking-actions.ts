"use server"

import { createServerClient } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"
import { sendBookingConfirmation } from "@/lib/services/resend-service"

export async function createBooking(formData: FormData) {
  const supabase = createServerClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Extract form data
  const bookingData = {
    user_id: user.id,
    service_id: formData.get("service_id") as string,
    scheduled_date: formData.get("scheduled_date") as string,
    scheduled_time: formData.get("scheduled_time") as string,
    address: formData.get("address") as string,
    special_instructions: formData.get("special_instructions") as string,
    estimated_price: Number.parseFloat(formData.get("estimated_price") as string),
    status: "scheduled",
  }

  // Validate required fields
  if (!bookingData.service_id || !bookingData.scheduled_date || !bookingData.scheduled_time || !bookingData.address) {
    throw new Error("Missing required booking information")
  }

  try {
    // Create booking
    const { data: booking, error } = await supabase.from("bookings").insert(bookingData).select().single()

    if (error) throw error

    // Find and assign provider
    const { data: providers } = await supabase
      .from("providers")
      .select("*")
      .eq("active", true)
      .contains("services", [bookingData.service_id])

    if (providers && providers.length > 0) {
      // Assign first available provider (in production, use better logic)
      const assignedProvider = providers[0]

      await supabase.from("bookings").update({ provider_id: assignedProvider.id }).eq("id", booking.id)

      // Create initial tracking record
      await supabase.from("tracking").insert({
        booking_id: booking.id,
        provider_id: assignedProvider.id,
        status: "assigned",
        notes: "Provider assigned to booking",
      })
    }

    // Send booking confirmation email
    if (user.email) {
      await sendBookingConfirmation(user.email, {
        ...booking,
        service_title: bookingData.service_id, // You might want to fetch the actual service title
      })
    }

    revalidatePath("/dashboard")
    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("Error creating booking:", error)
    throw new Error("Failed to create booking")
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
