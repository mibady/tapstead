import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"

interface AgentContext {
  sessionId: string
  conversationHistory: Array<{
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }>
  metadata: Record<string, any>
}

interface AgentResponse {
  content: string
  actions: Array<{
    type: string
    params: Record<string, any>
  }>
  confidence: number
  needsEscalation: boolean
}

type AgentType = "booking" | "support" | "recruiting" | "analytics"

class AIAgentService {
  private getModel(agentType: AgentType) {
    switch (agentType) {
      case "booking":
      case "recruiting":
        return openai("gpt-4o")
      case "support":
      case "analytics":
        return anthropic("claude-3-5-sonnet-20241022")
      default:
        return openai("gpt-4o")
    }
  }

  private getSystemPrompt(agentType: AgentType): string {
    const prompts = {
      booking: `You are a booking assistant for Tapstead, a home services platform.
      
      Your role:
      - Help customers book house cleaning and other home services
      - Provide accurate pricing information
      - Guide users through the booking process
      - Answer questions about services and availability
      
      Pricing Information:
      - House Cleaning: Small home ($149), Medium home ($199), Large home ($299)
      - Subscription Discounts: Weekly (33% off), Bi-weekly (27% off), Monthly (20% off)
      - Add-ons: Deep clean (+$75), Move-in/out cleaning (+$99)
      - Weekend surcharge: +10%, Same-day booking: +15%
      
      Available Services:
      - House Cleaning (primary service with fixed pricing)
      - Plumbing, Electrical, Handyman, Painting (quote-based)
      - Pressure washing, Gutter services, Junk removal
      
      Always be helpful, accurate, and guide users toward completing bookings.`,

      support: `You are a customer support agent for Tapstead.
      
      Your role:
      - Resolve customer issues and concerns
      - Handle booking modifications and cancellations
      - Address service quality complaints
      - Provide platform guidance and assistance
      
      Escalation triggers:
      - Refund requests
      - Legal threats or complaints
      - Provider misconduct reports
      - Complex billing disputes
      - Repeated service failures
      
      Always be empathetic, solution-focused, and professional.`,

      recruiting: `You are a provider recruitment agent for Tapstead.
      
      Your role:
      - Screen potential service providers
      - Guide them through the application process
      - Assess qualifications and experience
      - Explain platform requirements and benefits
      
      Requirements for providers:
      - Valid business license and insurance
      - Minimum 2 years relevant experience
      - Clean background check
      - Professional references
      - Commitment to quality standards
      
      Be thorough but encouraging, maintaining high standards.`,

      analytics: `You are a business analytics agent for Tapstead.
      
      Your role:
      - Analyze booking trends and patterns
      - Provide business insights and recommendations
      - Generate reports on key metrics
      - Identify growth opportunities
      
      Key metrics to track:
      - Booking conversion rates
      - Customer satisfaction scores
      - Provider performance metrics
      - Revenue trends by service type
      - Geographic performance data
      
      Provide data-driven insights and actionable recommendations.`,
    }

    return prompts[agentType]
  }

  async processMessage(agentType: AgentType, message: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const model = this.getModel(agentType)
      const systemPrompt = this.getSystemPrompt(agentType)

      const conversationContext = context.conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")

      const fullPrompt = `${systemPrompt}

Conversation History:
${conversationContext}

Current Message: ${message}

Context: ${JSON.stringify(context.metadata)}

Respond helpfully and appropriately for your role as a ${agentType} agent.`

      const result = await generateText({
        model,
        prompt: fullPrompt,
        maxTokens: 500,
        temperature: 0.7,
      })

      // Analyze response for actions and escalation needs
      const needsEscalation = this.checkEscalationTriggers(agentType, message, result.text)
      const actions = this.extractActions(agentType, result.text, context)
      const confidence = this.calculateConfidence(result.text, message)

      return {
        content: result.text,
        actions,
        confidence,
        needsEscalation,
      }
    } catch (error) {
      console.error(`Error processing ${agentType} message:`, error)
      return {
        content: "I apologize, but I'm experiencing technical difficulties. Let me connect you with a human agent.",
        actions: [],
        confidence: 0,
        needsEscalation: true,
      }
    }
  }

  async streamResponse(agentType: AgentType, message: string, context: AgentContext) {
    const model = this.getModel(agentType)
    const systemPrompt = this.getSystemPrompt(agentType)

    const conversationContext = context.conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")

    const fullPrompt = `${systemPrompt}

Conversation History:
${conversationContext}

Current Message: ${message}

Respond helpfully and appropriately.`

    return streamText({
      model,
      prompt: fullPrompt,
      maxTokens: 500,
      temperature: 0.7,
    })
  }

  private checkEscalationTriggers(agentType: AgentType, message: string, response: string): boolean {
    const escalationKeywords = {
      support: ["refund", "lawsuit", "lawyer", "complaint", "terrible", "worst"],
      booking: ["impossible", "never", "cancel everything"],
      recruiting: ["discrimination", "unfair", "illegal"],
      analytics: [], // Analytics rarely needs escalation
    }

    const keywords = escalationKeywords[agentType] || []
    const messageText = message.toLowerCase()

    return keywords.some((keyword) => messageText.includes(keyword))
  }

  private extractActions(agentType: AgentType, response: string, context: AgentContext) {
    const actions: Array<{ type: string; params: Record<string, any> }> = []

    // Extract booking actions
    if (agentType === "booking") {
      if (response.includes("book") || response.includes("schedule")) {
        actions.push({
          type: "initiate_booking",
          params: { service: "house-cleaning" },
        })
      }
      if (response.includes("price") || response.includes("cost")) {
        actions.push({
          type: "calculate_price",
          params: context.metadata,
        })
      }
    }

    // Extract support actions
    if (agentType === "support") {
      if (response.includes("cancel") || response.includes("refund")) {
        actions.push({
          type: "process_cancellation",
          params: { reason: "customer_request" },
        })
      }
    }

    return actions
  }

  private calculateConfidence(response: string, originalMessage: string): number {
    // Simple confidence calculation based on response characteristics
    let confidence = 0.5

    // Higher confidence for longer, more detailed responses
    if (response.length > 100) confidence += 0.2
    if (response.length > 200) confidence += 0.1

    // Higher confidence if response addresses the question directly
    const messageWords = originalMessage.toLowerCase().split(" ")
    const responseWords = response.toLowerCase().split(" ")
    const overlap = messageWords.filter((word) => responseWords.includes(word)).length
    confidence += (overlap / messageWords.length) * 0.3

    return Math.min(confidence, 1.0)
  }
}

export const aiAgentService = new AIAgentService()
