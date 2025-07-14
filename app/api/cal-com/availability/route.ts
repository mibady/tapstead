import { type NextRequest, NextResponse } from "next/server"
import { calComService } from "@/lib/integrations/cal-com"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventTypeId = searchParams.get("eventTypeId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    if (!eventTypeId || !dateFrom || !dateTo) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          required: ["eventTypeId", "dateFrom", "dateTo"],
        },
        { status: 400 },
      )
    }

    // Get available slots using Cal.com v2 API
    const availableSlots = await calComService.getAvailableSlots(Number.parseInt(eventTypeId), dateFrom, dateTo)

    // Get busy slots (existing bookings)
    const busySlots = await calComService.checkAvailability(Number.parseInt(eventTypeId), dateFrom, dateTo)

    return NextResponse.json({
      success: true,
      eventTypeId: Number.parseInt(eventTypeId),
      dateRange: { from: dateFrom, to: dateTo },
      availableSlots,
      busySlots,
      totalAvailable: availableSlots.length,
      totalBusy: busySlots.length,
    })
  } catch (error) {
    console.error("Availability check error:", error)
    return NextResponse.json(
      {
        error: "Failed to check availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventTypeId, dates } = body

    if (!eventTypeId || !dates || !Array.isArray(dates)) {
      return NextResponse.json({ error: "Missing eventTypeId or dates array" }, { status: 400 })
    }

    // Check availability for multiple dates
    const availabilityPromises = dates.map(async (date: string) => {
      const dateFrom = new Date(date).toISOString()
      const dateTo = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString()

      const [availableSlots, busySlots] = await Promise.all([
        calComService.getAvailableSlots(eventTypeId, dateFrom, dateTo),
        calComService.checkAvailability(eventTypeId, dateFrom, dateTo),
      ])

      return {
        date,
        availableSlots,
        busySlots,
        hasAvailability: availableSlots.length > 0,
        totalSlots: availableSlots.length,
      }
    })

    const results = await Promise.all(availabilityPromises)

    return NextResponse.json({
      success: true,
      eventTypeId,
      availability: results,
      summary: {
        totalDates: dates.length,
        datesWithAvailability: results.filter((r) => r.hasAvailability).length,
        totalAvailableSlots: results.reduce((sum, r) => sum + r.totalSlots, 0),
      },
    })
  } catch (error) {
    console.error("Bulk availability check error:", error)
    return NextResponse.json(
      {
        error: "Failed to check bulk availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
