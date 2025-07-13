import { type NextRequest, NextResponse } from "next/server"
import { aiAgentService } from "@/lib/ai/agents"

export async function GET() {
  return NextResponse.json({
    message: "AI Chat API is active",
    availableAgents: ["booking", "support", "recruiting", "analytics"],
    capabilities: {
      textGeneration: true,
      streaming: true,
      contextAware: true,
      multiModel: true,
    },
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, agentType, context, stream = false } = body

    if (!message || !agentType) {
      return NextResponse.json({ error: "Missing message or agentType" }, { status: 400 })
    }

    const validAgents = ["booking", "support", "recruiting", "analytics"]
    if (!validAgents.includes(agentType)) {
      return NextResponse.json(
        { error: `Invalid agent type. Must be one of: ${validAgents.join(", ")}` },
        { status: 400 },
      )
    }

    const agentContext = {
      sessionId: context?.sessionId || `session-${Date.now()}`,
      conversationHistory: context?.conversationHistory || [],
      metadata: context?.metadata || {},
    }

    if (stream) {
      // Handle streaming response
      const streamResult = await aiAgentService.streamResponse(agentType, message, agentContext)

      return new Response(streamResult.toAIStream(), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      })
    } else {
      // Handle regular response
      const result = await aiAgentService.processMessage(agentType, message, agentContext)

      return NextResponse.json({
        success: true,
        response: result.content,
        actions: result.actions,
        confidence: result.confidence,
        needsEscalation: result.needsEscalation,
        agentType,
        sessionId: agentContext.sessionId,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("AI Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
