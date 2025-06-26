"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { sendBookingConfirmation } from "@/lib/services/resend-service"
import { z } from "zod"

const BookingSchema = z.object({
  service_id: z.string().min(1, "Service is required"),
  scheduled_date: z.string().min(1, "Date is required"),
  scheduled_time: z.string().min(1, "Time is required"),
  address: z.string().min(1, "Address is required"),
  special_instructions: z.string().optional(),
  estimated_price: z.number().positive("Estimated price must be positive"),
  // NOTE: The 'bookings' table should be updated to include an 'estimated_duration' column
  // to make conflict checking more accurate.
  estimated_duration: z.number().positive("Estimated duration must be positive"),
})

async function findBestProvider(
  supabase: any,
  service_id: string,
  scheduled_date: string,
  scheduled_time: string,
  duration_hours: number
) {
  const { data: candidateProviders, error: providerError } = await supabase
    .from("providers")
    .select("id, user_id")
    .eq("active", true)
    .contains("services", [service_id])

  if (providerError || !candidateProviders || candidateProviders.length === 0) {
    console.error("No candidate providers found for the service:", providerError)
    return null
  }

  const providerIds = candidateProviders.map((p: any) => p.id)

  const { data: performanceData } = await supabase
    .from("provider_performance")
    .select("provider_id, rating, completed_jobs")
    .in("provider_id", providerIds)

  const performanceMap = new Map(
    performanceData?.map((p: any) => [p.provider_id, { rating: p.rating, completed_jobs: p.completed_jobs }])
  )

  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("provider_id, scheduled_time, estimated_duration") // Assumes 'estimated_duration' exists
    .in("provider_id", providerIds)
    .eq("scheduled_date", scheduled_date)
    .in("status", ["scheduled", "in_progress"])

  const dailyBookings = new Map<string, { time: string; duration: number }[]>()
  existingBookings?.forEach((b: any) => {
    if (!dailyBookings.has(b.provider_id)) {
      dailyBookings.set(b.provider_id, [])
    }
    dailyBookings.get(b.provider_id)!.push({ time: b.scheduled_time, duration: b.estimated_duration || 2 })
  })

  const bookingStartTime = new Date(`${scheduled_date}T${scheduled_time}`)
  const bookingEndTime = new Date(bookingStartTime.getTime() + duration_hours * 60 * 60 * 1000)

  const availableProviders = candidateProviders.filter((provider: any) => {
    const providerBookings = dailyBookings.get(provider.id)
    if (!providerBookings) return true

    return !providerBookings.some(existing => {
      const existingStartTime = new Date(`${scheduled_date}T${existing.time}`)
      const existingEndTime = new Date(existingStartTime.getTime() + existing.duration * 60 * 60 * 1000)
      return bookingStartTime < existingEndTime && bookingEndTime > existingStartTime
    })
  })

  if (availableProviders.length === 0) {
    console.warn("No available providers found after conflict check.")
    return null
  }

  const scoredProviders = availableProviders.map((provider: any) => {
    const perf = performanceMap.get(provider.id) || { rating: 2.5, completed_jobs: 0 }
    const score = ((perf as any)?.rating || 2.5) + ((perf as any)?.completed_jobs || 0) * 0.01
    return { provider_id: provider.id, score }
  })

  scoredProviders.sort((a: any, b: any) => b.score - a.score)

  return scoredProviders[0].provider_id
}

export async function createBooking(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: "Authentication required" }
  }

  const rawFormData = {
    service_id: formData.get("service_id"),
    scheduled_date: formData.get("scheduled_date"),
    scheduled_time: formData.get("scheduled_time"),
    address: formData.get("address"),
    special_instructions: formData.get("special_instructions"),
    estimated_price: Number.parseFloat(formData.get("estimated_price") as string),
    estimated_duration: Number.parseFloat(formData.get("estimated_duration") as string),
  }

  const validationResult = BookingSchema.safeParse(rawFormData)

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    }
  }

  const bookingData = {
    ...validationResult.data,
    user_id: user.id,
    status: "pending_assignment", // New initial status
  }

  try {
    const { data: booking, error } = await supabase.from("bookings").insert(bookingData).select().single()

    if (error) throw error

    const assignedProviderId = await findBestProvider(
      supabase,
      booking.service_id,
      booking.scheduled_date,
      booking.scheduled_time,
      booking.estimated_duration
    )

    if (assignedProviderId) {
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ provider_id: assignedProviderId, status: "scheduled" })
        .eq("id", booking.id)

      if (updateError) throw updateError

      await supabase.from("tracking").insert({
        booking_id: booking.id,
        provider_id: assignedProviderId,
        status: "assigned",
        notes: "Provider automatically assigned to booking.",
      })
    } else {
      console.warn(`Booking ${booking.id} created but no provider could be assigned.`)
      // An admin notification could be triggered here
    }

    if (user.email) {
      await sendBookingConfirmation(user.email, {
        ...booking,
        service_title: bookingData.service_id,
      })
    }

    revalidatePath("/dashboard")
    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false, message: "Failed to create booking" }
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const supabase = createServerClient()

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("Unauthorized: User not authenticated")
    }

    // Check if user owns the booking or is an admin/provider
    const { data: booking } = await supabase
      .from("bookings")
      .select(`
        id,
        user_id,
        provider_id,
        providers!inner(user_id)
      `)
      .eq("id", bookingId)
      .single()

    if (!booking) {
      throw new Error("Booking not found")
    }

    // Check authorization: user owns booking, or user is the assigned provider, or user is admin
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("customer_type")
      .eq("id", user.id)
      .single()

    const isOwner = booking.user_id === user.id
    const isAssignedProvider = booking.providers?.user_id === user.id
    const isAdmin = userProfile?.customer_type === "admin"

    if (!isOwner && !isAssignedProvider && !isAdmin) {
      throw new Error("Unauthorized: You don't have permission to update this booking")
    }

    // Update booking status
    const { error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId)

    if (error) throw error

    // Update tracking
    await supabase.from("tracking").insert({
      booking_id: bookingId,
      status,
      notes: `Booking status updated to ${status} by ${userProfile?.customer_type || 'user'}`,
      created_at: new Date().toISOString(),
    })

    revalidatePath("/dashboard")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error updating booking status:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to update booking status")
  }
}

export async function cancelBooking(bookingId: string) {
  const supabase = createServerClient()

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("Unauthorized: User not authenticated")
    }

    // Check if user owns the booking
    const { data: booking } = await supabase
      .from("bookings")
      .select("id, user_id, status")
      .eq("id", bookingId)
      .single()

    if (!booking) {
      throw new Error("Booking not found")
    }

    // Only the booking owner can cancel
    if (booking.user_id !== user.id) {
      throw new Error("Unauthorized: You can only cancel your own bookings")
    }

    // Check if booking can be cancelled
    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new Error("Cannot cancel a booking that is already completed or cancelled")
    }

    const { error } = await supabase
      .from("bookings")
      .update({ 
        status: "cancelled",
        updated_at: new Date().toISOString()
      })
      .eq("id", bookingId)

    if (error) throw error

    // Add tracking entry
    await supabase.from("tracking").insert({
      booking_id: bookingId,
      status: "cancelled",
      notes: "Booking cancelled by customer",
      created_at: new Date().toISOString(),
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to cancel booking")
  }
}
