import { type NextRequest, NextResponse } from "next/server"
import { calComService } from "@/lib/integrations/cal-com"
import { createServerClient } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventTypeId, start, end, attendee, metadata, tapsteadBookingId } = body

    // Validate required fields
    if (!eventTypeId || !start || !end || !attendee?.name || !attendee?.email) {
      return NextResponse.json({ error: "Missing required booking information" }, { status: 400 })
    }

    // Create booking with Cal.com
    const calComBooking = await calComService.createBooking({
      eventTypeId,
      start,
      end,
      attendee: {
        name: attendee.name,
        email: attendee.email,
        timeZone: attendee.timeZone || "America/New_York",
      },
      metadata: {
        ...metadata,
        tapstead_booking_id: tapsteadBookingId,
        source: "tapstead",
      },
    })

    // Update local booking record if tapsteadBookingId provided
    if (tapsteadBookingId) {
      const supabase = createServerClient()
      await supabase
        .from("bookings")
        .update({
          cal_com_booking_id: calComBooking.id,
          cal_com_uid: calComBooking.uid,
          status: "scheduled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", tapsteadBookingId)
    }

    return NextResponse.json({
      success: true,
      booking: calComBooking,
      message: "Booking created successfully",
    })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("bookingId")

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId parameter" }, { status: 400 })
    }

    // Get booking details from Cal.com
    const response = await fetch(`https://api.cal.com/v1/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CAL_COM_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Cal.com API error: ${response.statusText}`)
    }

    const booking = await response.json()

    return NextResponse.json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json({ error: "Failed to get booking details" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, start, end, reason } = body

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 })
    }

    if (start && end) {
      // Reschedule booking
      const updatedBooking = await calComService.rescheduleBooking(bookingId, start, end)

      return NextResponse.json({
        success: true,
        booking: updatedBooking,
        message: "Booking rescheduled successfully",
      })
    } else {
      return NextResponse.json({ error: "Missing start and end times for rescheduling" }, { status: 400 })
    }
  } catch (error) {
    console.error("Booking update error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("bookingId")
    const reason = searchParams.get("reason")

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId parameter" }, { status: 400 })
    }

    await calComService.cancelBooking(bookingId, reason || "Cancelled by user")

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    })
  } catch (error) {
    console.error("Booking cancellation error:", error)
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
  }
}
