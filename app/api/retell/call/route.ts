import { type NextRequest, NextResponse } from "next/server"
import { retellService } from "@/lib/integrations/retell-ai"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const callId = searchParams.get("callId")

    if (!callId) {
      return NextResponse.json({ error: "Missing callId parameter" }, { status: 400 })
    }

    const callDetails = await retellService.getCallDetails(callId)

    return NextResponse.json({
      success: true,
      call: callDetails,
    })
  } catch (error) {
    console.error("Error getting call details:", error)
    return NextResponse.json({ error: "Failed to get call details" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toNumber, agentType = "booking", metadata = {} } = body

    if (!toNumber) {
      return NextResponse.json({ error: "Missing toNumber" }, { status: 400 })
    }

    // Get agent ID based on type
    const agentIds = {
      booking: process.env.RETELL_BOOKING_AGENT_ID,
      support: process.env.RETELL_SUPPORT_AGENT_ID,
      recruiting: process.env.RETELL_RECRUITING_AGENT_ID,
    }

    const agentId = agentIds[agentType as keyof typeof agentIds] || process.env.RETELL_AGENT_ID

    if (!agentId) {
      return NextResponse.json({ error: `No agent configured for type: ${agentType}` }, { status: 400 })
    }

    const callRequest = {
      fromNumber: process.env.RETELL_PHONE_NUMBER || "+1234567890",
      toNumber,
      agentId,
      metadata: {
        ...metadata,
        agentType,
        source: "tapstead",
        timestamp: new Date().toISOString(),
      },
    }

    const result = await retellService.initiateCall(callRequest)

    // Log call in database
    const supabase = createServerClient()
    await supabase.from("calls").insert({
      call_id: result.callId,
      to_number: toNumber,
      agent_type: agentType,
      status: result.status,
      metadata: callRequest.metadata,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      callId: result.callId,
      status: result.status,
    })
  } catch (error) {
    console.error("Error initiating call:", error)
    return NextResponse.json({ error: "Failed to initiate call" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { callId, status, duration, transcript } = body

    if (!callId) {
      return NextResponse.json({ error: "Missing callId" }, { status: 400 })
    }

    // Update call record in database
    const supabase = createServerClient()
    const { error } = await supabase
      .from("calls")
      .update({
        status,
        duration,
        transcript,
        updated_at: new Date().toISOString(),
      })
      .eq("call_id", callId)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Call status updated",
    })
  } catch (error) {
    console.error("Error updating call:", error)
    return NextResponse.json({ error: "Failed to update call" }, { status: 500 })
  }
}
