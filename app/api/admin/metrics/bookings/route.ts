import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/client"
import { CacheService } from "@/lib/cache/redis"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check authentication and admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = (searchParams.get("range") as "hour" | "day" | "week") || "day"

    // Check cache first
    const cacheKey = `booking_metrics_${range}`
    const cached = await CacheService.getAnalytics(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case "hour":
        startDate.setHours(now.getHours() - 1)
        break
      case "day":
        startDate.setDate(now.getDate() - 1)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
    }

    // Fetch booking metrics
    const { data: bookings } = await supabase.from("bookings").select("*").gte("created_at", startDate.toISOString())

    const { data: quoteRequests } = await supabase
      .from("quote_requests")
      .select("*")
      .gte("created_at", startDate.toISOString())

    // Calculate metrics
    const totalBookings = (bookings?.length || 0) + (quoteRequests?.length || 0)
    const completedBookings = bookings?.filter((b) => b.status === "completed").length || 0
    const cancelledBookings = bookings?.filter((b) => b.status === "cancelled").length || 0

    // Calculate average booking time (mock data for now)
    const averageBookingTime = 145 // seconds

    // Calculate conversion rate
    const conversionRate = totalBookings > 0 ? completedBookings / totalBookings : 0

    // Calculate revenue
    const revenueTotal =
      bookings?.reduce((sum, booking) => {
        return sum + (booking.final_price || 0)
      }, 0) || 0

    const metrics = {
      totalBookings,
      completedBookings,
      cancelledBookings,
      averageBookingTime,
      conversionRate,
      revenueTotal,
    }

    // Cache for 5 minutes
    await CacheService.cacheAnalytics(cacheKey, metrics, 300)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Booking metrics API error:", error)
    return NextResponse.json({ error: "Failed to fetch booking metrics" }, { status: 500 })
  }
}
