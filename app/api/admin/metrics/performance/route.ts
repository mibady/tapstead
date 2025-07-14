import { type NextRequest, NextResponse } from "next/server"
import { PerformanceMonitor } from "@/lib/monitoring/performance"
import { createServerClient } from "@/lib/supabase/client"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check if user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = (searchParams.get("range") as "hour" | "day" | "week") || "day"

    const metrics = await PerformanceMonitor.getMetrics(range)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Performance metrics API error:", error)
    return NextResponse.json({ error: "Failed to fetch performance metrics" }, { status: 500 })
  }
}
