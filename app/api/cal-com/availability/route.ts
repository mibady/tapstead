import { type NextRequest, NextResponse } from "next/server"
import { calComService } from "@/lib/integrations/cal-com"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventTypeId = searchParams.get("eventTypeId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    if (!eventTypeId || !dateFrom || !dateTo) {
      return NextResponse.json({ error: "Missing required parameters: eventTypeId, dateFrom, dateTo" }, { status: 400 })
    }

    const availability = await calComService.checkAvailability(Number.parseInt(eventTypeId), dateFrom, dateTo)

    return NextResponse.json({
      success: true,
      availability,
      eventTypeId: Number.parseInt(eventTypeId),
      dateRange: { from: dateFrom, to: dateTo },
    })
  } catch (error) {
    console.error("Availability check error:", error)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventTypeId, dates } = body

    if (!eventTypeId || !dates || !Array.isArray(dates)) {
      return NextResponse.json({ error: "Missing eventTypeId or dates array" }, { status: 400 })
    }

    const availabilityPromises = dates.map(async (date: string) => {
      const dateFrom = new Date(date).toISOString()
      const dateTo = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString()

      const slots = await calComService.checkAvailability(eventTypeId, dateFrom, dateTo)
      return {
        date,
        available: slots.length === 0, // No busy slots means available
        slots,
      }
    })

    const results = await Promise.all(availabilityPromises)

    return NextResponse.json({
      success: true,
      availability: results,
    })
  } catch (error) {
    console.error("Bulk availability check error:", error)
    return NextResponse.json({ error: "Failed to check bulk availability" }, { status: 500 })
  }
}
