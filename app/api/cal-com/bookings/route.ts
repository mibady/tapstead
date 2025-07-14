import { type NextRequest, NextResponse } from "next/server"
import { calComService } from "@/lib/integrations/cal-com"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventTypeId, start, end, attendee, metadata, tapsteadBookingId, responses } = body

    // Validate required fields
    if (!eventTypeId || !start || !end || !attendee?.name || !attendee?.email) {
      return NextResponse.json(
        {
          error: "Missing required booking information",
          required: ["eventTypeId", "start", "end", "attendee.name", "attendee.email"],
        },
        { status: 400 },
      )
    }

    // Reserve the slot first to prevent double booking
    const reservation = await calComService.reserveSlot(eventTypeId, start)

    try {
      // Create booking with Cal.com v2 API
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
          reservation_uid: reservation.uid,
        },
        responses: responses || {},
      })

      // Update local booking record if tapsteadBookingId provided
      if (tapsteadBookingId) {
        const supabase = await createServerClient()
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            cal_com_booking_id: calComBooking.id,
            cal_com_uid: calComBooking.uid,
            status: "scheduled",
            confirmed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", tapsteadBookingId)

        if (updateError) {
          console.error("Error updating local booking:", updateError)
        }
      }

      return NextResponse.json({
        success: true,
        booking: calComBooking,
        reservation: reservation.uid,
        message: "Booking created successfully",
      })
    } catch (bookingError) {
      // Clean up reservation if booking fails
      try {
        await calComService.deleteReservedSlot(reservation.uid)
      } catch (cleanupError) {
        console.error("Error cleaning up reservation:", cleanupError)
      }
      throw bookingError
    }
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("bookingId")
    const eventTypeId = searchParams.get("eventTypeId")
    const startTime = searchParams.get("startTime")
    const endTime = searchParams.get("endTime")

    if (bookingId) {
      // Get specific booking
      const booking = await calComService.getBooking(bookingId)
      return NextResponse.json({
        success: true,
        booking,
      })
    } else {
      // Get bookings with filters
      const filters: any = {}
      if (eventTypeId) filters.eventTypeId = Number.parseInt(eventTypeId)
      if (startTime) filters.startTime = startTime
      if (endTime) filters.endTime = endTime

      const bookings = await calComService.getBookings(filters)
      return NextResponse.json({
        success: true,
        bookings,
        count: bookings.length,
      })
    }
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json(
      {
        error: "Failed to get booking details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
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

      // Update local database
      const supabase = await createServerClient()
      await supabase
        .from("bookings")
        .update({
          scheduled_at: start,
          status: "rescheduled",
          updated_at: new Date().toISOString(),
        })
        .eq("cal_com_booking_id", bookingId)

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
    return NextResponse.json(
      {
        error: "Failed to update booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
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

    // Update local database
    const supabase = await createServerClient()
    await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("cal_com_booking_id", bookingId)

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    })
  } catch (error) {
    console.error("Booking cancellation error:", error)
    return NextResponse.json(
      {
        error: "Failed to cancel booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
