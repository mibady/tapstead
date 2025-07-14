import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { retellService } from "@/lib/integrations/retell-ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toNumber, agentType, customerData, serviceData } = body

    // Validate required fields
    if (!toNumber || !agentType) {
      return NextResponse.json({ error: "Missing required fields: toNumber, agentType" }, { status: 400 })
    }

    // Get agent ID based on type
    let agentId: string
    switch (agentType) {
      case "booking":
        agentId = process.env.RETELL_BOOKING_AGENT_ID || ""
        break
      case "support":
        agentId = process.env.RETELL_SUPPORT_AGENT_ID || ""
        break
      case "recruiting":
        agentId = process.env.RETELL_RECRUITING_AGENT_ID || ""
        break
      default:
        return NextResponse.json(
          { error: "Invalid agent type. Must be: booking, support, or recruiting" },
          { status: 400 },
        )
    }

    if (!agentId) {
      return NextResponse.json({ error: `Agent ID not configured for type: ${agentType}` }, { status: 500 })
    }

    // Prepare metadata and dynamic variables
    const metadata = {
      agent_type: agentType,
      customer_data: customerData,
      service_data: serviceData,
      initiated_at: new Date().toISOString(),
      source: "tapstead_platform",
    }

    const retellLlmDynamicVariables = {
      customer_name: customerData?.name || "Customer",
      customer_email: customerData?.email || "",
      service_type: serviceData?.type || "",
      ...customerData,
      ...serviceData,
    }

    // Create the call
    const callResponse = await retellService.initiateCall({
      toNumber,
      agentId,
      metadata,
      retellLlmDynamicVariables,
    })

    // Log the call initiation in our database
    const supabase = await createClient()
    await supabase.from("call_logs").insert({
      call_id: callResponse.callId,
      agent_id: callResponse.agentId,
      call_type: callResponse.callType,
      from_number: process.env.RETELL_PHONE_NUMBER,
      to_number: toNumber,
      direction: "outbound",
      status: "initiated",
      metadata,
      retell_llm_dynamic_variables: retellLlmDynamicVariables,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      callId: callResponse.callId,
      callStatus: callResponse.callStatus,
      message: "Call initiated successfully",
    })
  } catch (error) {
    console.error("Error initiating call:", error)
    return NextResponse.json(
      { error: "Failed to initiate call", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const callId = searchParams.get("callId")

    if (!callId) {
      return NextResponse.json({ error: "Missing callId parameter" }, { status: 400 })
    }

    // Get call details from Retell
    const callDetails = await retellService.getCall(callId)

    return NextResponse.json({
      success: true,
      call: callDetails,
    })
  } catch (error) {
    console.error("Error getting call details:", error)
    return NextResponse.json(
      { error: "Failed to get call details", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { callId, action, data } = body

    if (!callId || !action) {
      return NextResponse.json({ error: "Missing required fields: callId, action" }, { status: 400 })
    }

    const supabase = await createClient()

    switch (action) {
      case "update_status":
        // Update call status in database
        await supabase
          .from("call_logs")
          .update({
            status: data.status,
            updated_at: new Date().toISOString(),
          })
          .eq("call_id", callId)

        return NextResponse.json({
          success: true,
          message: "Call status updated successfully",
        })

      case "add_notes":
        // Add notes to the call
        await supabase
          .from("call_logs")
          .update({
            notes: data.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("call_id", callId)

        return NextResponse.json({
          success: true,
          message: "Call notes added successfully",
        })

      case "end_call":
        // End the call via Retell API
        await retellService.endCall(callId)

        // Update database
        await supabase
          .from("call_logs")
          .update({
            status: "ended",
            ended_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("call_id", callId)

        return NextResponse.json({
          success: true,
          message: "Call ended successfully",
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating call:", error)
    return NextResponse.json(
      { error: "Failed to update call", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
