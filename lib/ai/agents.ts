import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { providerTools } from "./provider-tools"

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
  toolResults?: any[]
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
      - Find and match customers with available providers
      - Check real-time provider availability using Cal.com integration
      - Provide accurate pricing information
      - Guide users through the booking process
      
      Available Tools:
      - findProviders: Search for available providers based on service, location, and time
      - checkProviderAvailability: Check real-time availability for specific providers
      - bookWithProvider: Complete the booking process with a chosen provider
      - getProviderSchedule: View provider's upcoming availability
      
      Pricing Information:
      - House Cleaning: Small home ($149), Medium home ($199), Large home ($299)
      - Subscription Discounts: Weekly (33% off), Bi-weekly (27% off), Monthly (20% off)
      - Add-ons: Deep clean (+$75), Move-in/out cleaning (+$99)
      - Weekend surcharge: +10%, Same-day booking: +15%
      
      Always use the tools to find real providers and check actual availability.
      Be helpful, accurate, and guide users toward completing bookings.`,

      support: `You are a customer support agent for Tapstead.
      
      Your role:
      - Resolve customer issues and concerns
      - Handle booking modifications and cancellations using Cal.com integration
      - Address service quality complaints
      - Provide platform guidance and assistance
      
      Available Tools:
      - checkProviderAvailability: Check if rescheduling is possible
      - getProviderSchedule: Help find alternative appointment times
      
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
      - Help providers set up their Cal.com integration
      
      Requirements for providers:
      - Valid business license and insurance
      - Minimum 2 years relevant experience
      - Clean background check
      - Professional references
      - Cal.com calendar integration for scheduling
      - Commitment to quality standards
      
      Be thorough but encouraging, maintaining high standards.`,

      analytics: `You are a business analytics agent for Tapstead.
      
      Your role:
      - Analyze booking trends and patterns
      - Provide business insights and recommendations
      - Generate reports on key metrics
      - Identify growth opportunities
      - Monitor provider performance and availability
      
      Available Tools:
      - getProviderSchedule: Analyze provider availability patterns
      - checkProviderAvailability: Monitor real-time capacity
      
      Key metrics to track:
      - Booking conversion rates
      - Customer satisfaction scores
      - Provider performance metrics
      - Revenue trends by service type
      - Geographic performance data
      - Provider availability and utilization
      
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

Use the available tools when appropriate to provide accurate, real-time information.
Respond helpfully and appropriately for your role as a ${agentType} agent.`

      // Get available tools for this agent type
      const tools = this.getToolsForAgent(agentType)

      const result = await generateText({
        model,
        prompt: fullPrompt,
        tools,
        maxTokens: 1000,
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
        toolResults: result.toolResults,
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

  private getToolsForAgent(agentType: AgentType) {
    switch (agentType) {
      case "booking":
        return {
          findProviders: providerTools.findProviders,
          checkProviderAvailability: providerTools.checkProviderAvailability,
          bookWithProvider: providerTools.bookWithProvider,
          getProviderSchedule: providerTools.getProviderSchedule,
        }
      case "support":
        return {
          checkProviderAvailability: providerTools.checkProviderAvailability,
          getProviderSchedule: providerTools.getProviderSchedule,
        }
      case "analytics":
        return {
          getProviderSchedule: providerTools.getProviderSchedule,
          checkProviderAvailability: providerTools.checkProviderAvailability,
        }
      default:
        return {}
    }
  }

  async streamResponse(agentType: AgentType, message: string, context: AgentContext) {
    const model = this.getModel(agentType)
    const systemPrompt = this.getSystemPrompt(agentType)
    const tools = this.getToolsForAgent(agentType)

    const conversationContext = context.conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")

    const fullPrompt = `${systemPrompt}

Conversation History:
${conversationContext}

Current Message: ${message}

Use the available tools when appropriate to provide accurate, real-time information.
Respond helpfully and appropriately.`

    return streamText({
      model,
      prompt: fullPrompt,
      tools,
      maxTokens: 1000,
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
          params: { service: context.metadata.serviceType || "house-cleaning" },
        })
      }
      if (response.includes("find providers") || response.includes("search providers")) {
        actions.push({
          type: "find_providers",
          params: context.metadata,
        })
      }
    }

    // Extract support actions
    if (agentType === "support") {
      if (response.includes("reschedule") || response.includes("change appointment")) {
        actions.push({
          type: "reschedule_booking",
          params: { bookingId: context.metadata.bookingId },
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
