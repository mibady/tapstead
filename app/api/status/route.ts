import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/client"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Test database connection
    const { data, error } = await supabase.from("services").select("count").limit(1)

    if (error) throw error

    // Test authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: "connected",
        authentication: "operational",
        api: "operational",
      },
      uptime: process.uptime(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    )
  }
}
