import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Return PostHog configuration for client-side initialization
    // Only return non-sensitive configuration
    return NextResponse.json({
      apiHost: "https://app.posthog.com",
      // Don't expose the actual key - client will use a public endpoint
      initialized: true,
    })
  } catch (error) {
    console.error("PostHog config error:", error)
    return NextResponse.json({ error: "Failed to get analytics config" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, properties } = body

    // Server-side PostHog tracking using the secure key
    if (process.env.POSTHOG_KEY) {
      // Here you would implement server-side PostHog tracking
      // For now, just log the event
      console.log("PostHog Event:", { event, properties })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PostHog tracking error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
