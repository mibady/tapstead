import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { resendService } from "@/lib/services/resend-service"

interface CalComWebhookEvent {
  triggerEvent: string
  createdAt: string
  payload: {
    booking: {
      id: number
      uid: string
      title: string
      description?: string
      customInputs?: Record<string, any>
      startTime: string
      endTime: string
      attendees: Array<{
        name: string
        email: string
        timeZone: string
      }>
      organizer: {
        id: number
        name: string
        email: string
      }
      responses?: Record<string, any>
      location?: string
      status: "ACCEPTED" | "PENDING" | "CANCELLED" | "REJECTED"
      metadata?: Record<string, any>
      eventType: {
        id: number
        title: string
        slug: string
      }
    }
    rescheduleUid?: string
    rescheduleStartTime?: string
    rescheduleEndTime?: string
    cancellationReason?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-cal-signature")

    // Verify webhook signature
    const webhookSecret = process.env.CAL_COM_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const crypto = require("crypto")
      const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")

      if (signature !== `sha256=${expectedSignature}`) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const event: CalComWebhookEvent = JSON.parse(body)
    const supabase = await createClient()

    console.log("Cal.com webhook received:", event.triggerEvent, event.payload.booking.uid)

    switch (event.triggerEvent) {
      case "BOOKING_CREATED":
        await handleBookingCreated(supabase, event.payload)
        break
      case "BOOKING_CANCELLED":
        await handleBookingCancelled(supabase, event.payload)
        break
      case "BOOKING_RESCHEDULED":
        await handleBookingRescheduled(supabase, event.payload)
        break
      case "BOOKING_CONFIRMED":
        await handleBookingConfirmed(supabase, event.payload)
        break
      case "BOOKING_REJECTED":
        await handleBookingRejected(supabase, event.payload)
        break
      case "MEETING_ENDED":
        await handleMeetingEnded(supabase, event.payload)
        break
      default:
        console.log("Unhandled webhook event:", event.triggerEvent)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cal.com webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleBookingCreated(supabase: any, payload: CalComWebhookEvent["payload"]) {
  const { booking } = payload
  const tapsteadBookingId = booking.metadata?.tapstead_booking_id

  if (tapsteadBookingId) {
    // Update existing Tapstead booking
    await supabase
      .from("bookings")
      .update({
        cal_com_booking_id: booking.id,
        cal_com_uid: booking.uid,
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", tapsteadBookingId)
  } else {
    // Create new booking from Cal.com (direct booking)
    const attendee = booking.attendees[0]
    const serviceType = booking.responses?.serviceType || booking.eventType.title

    await supabase.from("bookings").insert({
      cal_com_booking_id: booking.id,
      cal_com_uid: booking.uid,
      service_type: serviceType,
      customer_name: attendee.name,
      customer_email: attendee.email,
      address: booking.responses?.address || booking.location,
      scheduled_date: new Date(booking.startTime).toISOString().split("T")[0],
      scheduled_time: new Date(booking.startTime).toTimeString().slice(0, 5),
      description: booking.responses?.specialInstructions || booking.description,
      status: "confirmed",
      source: "cal_com_direct",
      created_at: new Date().toISOString(),
    })
  }

  // Send confirmation email
  const attendee = booking.attendees[0]
  await resendService.sendBookingConfirmation(attendee.email, {
    id: booking.uid,
    service_title: booking.title,
    scheduled_date: new Date(booking.startTime).toLocaleDateString(),
    scheduled_time: new Date(booking.startTime).toLocaleTimeString(),
    customer_name: attendee.name,
    customer_email: attendee.email,
    customer_phone: booking.responses?.phone || "",
    address: booking.responses?.address || booking.location || "",
    total_amount: 0, // Will be calculated based on service
    special_instructions: booking.responses?.specialInstructions,
  })
}

async function handleBookingCancelled(supabase: any, payload: CalComWebhookEvent["payload"]) {
  const { booking, cancellationReason } = payload

  await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancellation_reason: cancellationReason,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("cal_com_booking_id", booking.id)

  // Send cancellation email
  const attendee = booking.attendees[0]
  await resendService.sendBookingCancellation(
    attendee.email,
    {
      id: booking.uid,
      service_title: booking.title,
      scheduled_date: new Date(booking.startTime).toLocaleDateString(),
      scheduled_time: new Date(booking.startTime).toLocaleTimeString(),
      customer_name: attendee.name,
      customer_email: attendee.email,
      customer_phone: "",
      address: booking.location || "",
      total_amount: 0,
    },
    cancellationReason,
  )
}

async function handleBookingRescheduled(supabase: any, payload: CalComWebhookEvent["payload"]) {
  const { booking, rescheduleStartTime, rescheduleEndTime } = payload

  if (rescheduleStartTime) {
    await supabase
      .from("bookings")
      .update({
        scheduled_date: new Date(rescheduleStartTime).toISOString().split("T")[0],
        scheduled_time: new Date(rescheduleStartTime).toTimeString().slice(0, 5),
        status: "rescheduled",
        updated_at: new Date().toISOString(),
      })
      .eq("cal_com_booking_id", booking.id)

    // Send rescheduled confirmation
    const attendee = booking.attendees[0]
    await resendService.sendBookingConfirmation(attendee.email, {
      id: booking.uid,
      service_title: booking.title,
      scheduled_date: new Date(rescheduleStartTime).toLocaleDateString(),
      scheduled_time: new Date(rescheduleStartTime).toLocaleTimeString(),
      customer_name: attendee.name,
      customer_email: attendee.email,
      customer_phone: "",
      address: booking.location || "",
      total_amount: 0,
    })
  }
}

async function handleBookingConfirmed(supabase: any, payload: CalComWebhookEvent["payload"]) {
  const { booking } = payload

  await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("cal_com_booking_id", booking.id)
}

async function handleBookingRejected(supabase: any, payload: CalComWebhookEvent["payload"]) {
  const { booking } = payload

  await supabase
    .from("bookings")
    .update({
      status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("cal_com_booking_id", booking.id)
}

async function handleMeetingEnded(supabase: any, payload: CalComWebhookEvent["payload"]) {
  const { booking } = payload

  await supabase
    .from("bookings")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("cal_com_booking_id", booking.id)

  // Send completion follow-up email
  const attendee = booking.attendees[0]
  // Implementation would depend on your follow-up email template
}

export async function GET() {
  return NextResponse.json({
    message: "Cal.com webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
