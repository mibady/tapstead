import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { triggerEvent, payload } = body

    console.log("Cal.com webhook received:", { triggerEvent, payload })

    const supabase = createServerClient()

    switch (triggerEvent) {
      case "BOOKING_CREATED":
        await handleBookingCreated(supabase, payload)
        break
      case "BOOKING_CANCELLED":
        await handleBookingCancelled(supabase, payload)
        break
      case "BOOKING_RESCHEDULED":
        await handleBookingRescheduled(supabase, payload)
        break
      case "BOOKING_CONFIRMED":
        await handleBookingConfirmed(supabase, payload)
        break
      default:
        console.log("Unhandled webhook event:", triggerEvent)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleBookingCreated(supabase: any, payload: any) {
  const { booking } = payload

  // Update local booking record with Cal.com booking ID
  const { error } = await supabase
    .from("bookings")
    .update({
      cal_com_booking_id: booking.id,
      cal_com_uid: booking.uid,
      status: "confirmed",
      scheduled_at: booking.startTime,
      updated_at: new Date().toISOString(),
    })
    .eq("id", booking.metadata?.tapstead_booking_id)

  if (error) {
    console.error("Error updating booking:", error)
    throw error
  }

  // Send confirmation email/SMS
  // This would integrate with your notification system
  console.log("Booking confirmed:", booking.id)
}

async function handleBookingCancelled(supabase: any, payload: any) {
  const { booking } = payload

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("cal_com_booking_id", booking.id)

  if (error) {
    console.error("Error cancelling booking:", error)
    throw error
  }

  console.log("Booking cancelled:", booking.id)
}

async function handleBookingRescheduled(supabase: any, payload: any) {
  const { booking } = payload

  const { error } = await supabase
    .from("bookings")
    .update({
      scheduled_at: booking.startTime,
      status: "rescheduled",
      updated_at: new Date().toISOString(),
    })
    .eq("cal_com_booking_id", booking.id)

  if (error) {
    console.error("Error rescheduling booking:", error)
    throw error
  }

  console.log("Booking rescheduled:", booking.id)
}

async function handleBookingConfirmed(supabase: any, payload: any) {
  const { booking } = payload

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("cal_com_booking_id", booking.id)

  if (error) {
    console.error("Error confirming booking:", error)
    throw error
  }

  console.log("Booking confirmed:", booking.id)
}

export async function GET() {
  return NextResponse.json({
    message: "Cal.com webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
