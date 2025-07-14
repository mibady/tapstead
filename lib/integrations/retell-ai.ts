import { Retell } from "retell-sdk"

interface CallRequest {
  fromNumber: string
  toNumber: string
  agentId: string
  metadata?: Record<string, any>
  retellLlmDynamicVariables?: Record<string, any>
}

interface CallResponse {
  callId: string
  callStatus: string
  callType: string
  agentId: string
  fromNumber: string
  toNumber: string
}

interface AgentConfig {
  agentName: string
  voiceId: string
  language: string
  responseEngine: {
    type: "retell-llm" | "openai" | "custom-llm"
    llmWebsocketUrl?: string
    llmId?: string
  }
  agentPrompt?: string
  beginMessage?: string
  enableBackchannel?: boolean
  backchannelFrequency?: number
  backchannelWords?: string[]
  reminderTriggerMs?: number
  reminderMaxCount?: number
  ambientSound?:
    | "coffee-shop"
    | "convention-hall"
    | "summer-outdoor"
    | "mountain-outdoor"
    | "static-noise"
    | "call-center"
  ambientSoundVolume?: number
  interruptionSensitivity?: number
  responsiveness?: number
  enableVoicemailDetection?: boolean
  voicemailMessage?: string
  voicemailDetectionTimeoutMs?: number
  maxCallDurationMs?: number
  silenceTimeoutMs?: number
  boostedKeywords?: string[]
  formatText?: boolean
  pronunciationDictionary?: Array<{
    word: string
    pronunciation: string
    caseSensitive?: boolean
  }>
  normalizeForSpeech?: boolean
  enableTranscriptionFormatting?: boolean
  optOutSensitiveDataStorage?: boolean
  webhookUrl?: string
}

class RetellAIService {
  private client: Retell

  constructor() {
    this.client = new Retell({
      apiKey: process.env.RETELL_API_KEY || "",
    })
  }

  // Call Management
  async createPhoneCall(request: CallRequest): Promise<CallResponse> {
    try {
      const response = await this.client.call.createPhoneCall({
        fromNumber: request.fromNumber,
        toNumber: request.toNumber,
        agentId: request.agentId,
        metadata: request.metadata,
        retellLlmDynamicVariables: request.retellLlmDynamicVariables,
      })

      return {
        callId: response.callId,
        callStatus: response.callStatus,
        callType: response.callType,
        agentId: response.agentId,
        fromNumber: response.fromNumber,
        toNumber: response.toNumber,
      }
    } catch (error) {
      console.error("Error creating phone call:", error)
      throw new Error(`Failed to create phone call: ${error}`)
    }
  }

  async registerCall(request: {
    agentId: string
    audioWebsocketProtocol: "web" | "twilio"
    audioEncoding: "mulaw" | "s16le"
    sampleRate: 8000 | 16000 | 24000 | 44100
    endCallAfterSilenceMs?: number
    fromNumber?: string
    toNumber?: string
    metadata?: Record<string, any>
  }) {
    try {
      return await this.client.call.register(request)
    } catch (error) {
      console.error("Error registering call:", error)
      throw new Error(`Failed to register call: ${error}`)
    }
  }

  async getCall(callId: string) {
    try {
      return await this.client.call.retrieve(callId)
    } catch (error) {
      console.error("Error getting call:", error)
      throw new Error(`Failed to get call: ${error}`)
    }
  }

  async listCalls(options?: {
    filterCriteria?: {
      agentId?: string
      callType?: string
      metadata?: Record<string, any>
      lastModificationTimestampAfter?: number
      lastModificationTimestampBefore?: number
    }
    pagination?: {
      limit?: number
      paginationKey?: string
    }
  }) {
    try {
      return await this.client.call.list(options)
    } catch (error) {
      console.error("Error listing calls:", error)
      throw new Error(`Failed to list calls: ${error}`)
    }
  }

  // Agent Management
  async createAgent(config: AgentConfig) {
    try {
      return await this.client.agent.create({
        agentName: config.agentName,
        voiceId: config.voiceId,
        language: config.language,
        responseEngine: config.responseEngine,
        agentPrompt: config.agentPrompt,
        beginMessage: config.beginMessage,
        enableBackchannel: config.enableBackchannel,
        backchannelFrequency: config.backchannelFrequency,
        backchannelWords: config.backchannelWords,
        reminderTriggerMs: config.reminderTriggerMs,
        reminderMaxCount: config.reminderMaxCount,
        ambientSound: config.ambientSound,
        ambientSoundVolume: config.ambientSoundVolume,
        interruptionSensitivity: config.interruptionSensitivity,
        responsiveness: config.responsiveness,
        enableVoicemailDetection: config.enableVoicemailDetection,
        voicemailMessage: config.voicemailMessage,
        voicemailDetectionTimeoutMs: config.voicemailDetectionTimeoutMs,
        maxCallDurationMs: config.maxCallDurationMs,
        silenceTimeoutMs: config.silenceTimeoutMs,
        boostedKeywords: config.boostedKeywords,
        formatText: config.formatText,
        pronunciationDictionary: config.pronunciationDictionary,
        normalizeForSpeech: config.normalizeForSpeech,
        enableTranscriptionFormatting: config.enableTranscriptionFormatting,
        optOutSensitiveDataStorage: config.optOutSensitiveDataStorage,
        webhookUrl: config.webhookUrl,
      })
    } catch (error) {
      console.error("Error creating agent:", error)
      throw new Error(`Failed to create agent: ${error}`)
    }
  }

  async getAgent(agentId: string) {
    try {
      return await this.client.agent.retrieve(agentId)
    } catch (error) {
      console.error("Error getting agent:", error)
      throw new Error(`Failed to get agent: ${error}`)
    }
  }

  async updateAgent(agentId: string, updates: Partial<AgentConfig>) {
    try {
      return await this.client.agent.update(agentId, updates)
    } catch (error) {
      console.error("Error updating agent:", error)
      throw new Error(`Failed to update agent: ${error}`)
    }
  }

  async deleteAgent(agentId: string) {
    try {
      await this.client.agent.delete(agentId)
    } catch (error) {
      console.error("Error deleting agent:", error)
      throw new Error(`Failed to delete agent: ${error}`)
    }
  }

  async listAgents() {
    try {
      return await this.client.agent.list()
    } catch (error) {
      console.error("Error listing agents:", error)
      throw new Error(`Failed to list agents: ${error}`)
    }
  }

  // Phone Number Management
  async listPhoneNumbers() {
    try {
      return await this.client.phoneNumber.list()
    } catch (error) {
      console.error("Error listing phone numbers:", error)
      throw new Error(`Failed to list phone numbers: ${error}`)
    }
  }

  async getPhoneNumber(phoneNumber: string) {
    try {
      return await this.client.phoneNumber.retrieve(phoneNumber)
    } catch (error) {
      console.error("Error getting phone number:", error)
      throw new Error(`Failed to get phone number: ${error}`)
    }
  }

  async updatePhoneNumber(phoneNumber: string, updates: { agentId?: string }) {
    try {
      return await this.client.phoneNumber.update(phoneNumber, updates)
    } catch (error) {
      console.error("Error updating phone number:", error)
      throw new Error(`Failed to update phone number: ${error}`)
    }
  }

  // Predefined Agents for Tapstead
  async createBookingAgent(): Promise<any> {
    const config: AgentConfig = {
      agentName: "Tapstead Booking Assistant",
      voiceId: "11labs-Adrian",
      language: "en-US",
      responseEngine: {
        type: "retell-llm",
      },
      agentPrompt: `You are a helpful booking assistant for Tapstead, a home services platform. Your role is to help customers book house cleaning services and collect quotes for other services.

Key Information:
- House cleaning pricing: Small home ($149), Medium home ($199), Large home ($299)
- Subscription discounts: Weekly (33% off), Bi-weekly (27% off), Monthly (20% off)
- Available services: House cleaning (instant booking), plumbing, electrical, handyman, painting (quote-based)
- Service areas: Major metropolitan areas

For house cleaning:
1. Ask about home size (1-2 bedrooms = small, 3-4 = medium, 5+ = large)
2. Ask about frequency (one-time, weekly, bi-weekly, monthly)
3. Ask about add-ons (deep clean +$75, move in/out +$99)
4. Collect address and preferred date/time
5. Process instant booking with payment

For other services:
1. Collect detailed description of work needed
2. Ask about preferred timeline
3. Collect contact information
4. Explain that we'll call back within 2 hours with a quote

Always be friendly, professional, and helpful. Ask clarifying questions to understand the customer's needs.`,
      beginMessage:
        "Hi! I'm here to help you book home services with Tapstead. What service are you interested in today?",
      enableBackchannel: true,
      backchannelFrequency: 0.9,
      backchannelWords: ["mm-hmm", "yeah", "right", "okay", "I see"],
      interruptionSensitivity: 1,
      responsiveness: 1,
      enableVoicemailDetection: true,
      voicemailMessage:
        "Hi, you've reached Tapstead! Please visit our website at tapstead.com to book services online, or call us back during business hours. Thanks!",
      maxCallDurationMs: 1800000, // 30 minutes
      silenceTimeoutMs: 10000, // 10 seconds
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/retell/webhook`,
    }

    return this.createAgent(config)
  }

  async createSupportAgent(): Promise<any> {
    const config: AgentConfig = {
      agentName: "Tapstead Support Agent",
      voiceId: "11labs-Rachel",
      language: "en-US",
      responseEngine: {
        type: "retell-llm",
      },
      agentPrompt: `You are a customer support agent for Tapstead. Your role is to help customers with questions, concerns, and issues related to their bookings and services.

Common issues you can help with:
- Booking modifications and cancellations
- Service quality concerns
- Payment and billing questions
- Provider communication issues
- General platform questions
- Rescheduling appointments

You have access to customer booking information and can:
1. Look up existing bookings by phone number or email
2. Reschedule appointments if providers have availability
3. Process refunds for cancelled services
4. Connect customers with providers
5. Escalate complex issues to human agents

Always be empathetic, solution-focused, and professional. If you cannot resolve an issue, escalate to a human agent and provide a callback within 2 hours.`,
      beginMessage:
        "Hello! I'm here to help with any questions or concerns about your Tapstead experience. How can I assist you today?",
      enableBackchannel: true,
      interruptionSensitivity: 0.8,
      responsiveness: 1.2,
      enableVoicemailDetection: true,
      voicemailMessage:
        "Hi, you've reached Tapstead support! For immediate assistance, please visit our website or call back during business hours. We'll get back to you as soon as possible!",
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/retell/webhook`,
    }

    return this.createAgent(config)
  }

  async createRecruitingAgent(): Promise<any> {
    const config: AgentConfig = {
      agentName: "Tapstead Provider Recruiter",
      voiceId: "11labs-Josh",
      language: "en-US",
      responseEngine: {
        type: "retell-llm",
      },
      agentPrompt: `You are a recruiting agent for Tapstead, helping to onboard new service providers. Your role is to screen potential providers and guide them through the application process.

Key requirements for providers:
- Valid business license and insurance
- Minimum 2 years experience in their service area
- Background check clearance
- Professional references
- Commitment to quality service standards
- Own tools and transportation

Services we need providers for:
- House cleaning
- Plumbing
- Electrical work
- Handyman services
- Painting
- Pressure washing
- Gutter services
- Junk removal

Screening process:
1. Verify experience and qualifications
2. Discuss service areas and availability
3. Explain our platform and commission structure
4. Collect application information
5. Schedule follow-up for background check

Be professional, thorough, and encouraging while maintaining high standards. Only recommend qualified candidates for the next step.`,
      beginMessage:
        "Welcome to Tapstead! I'm excited to learn about your interest in joining our provider network. Let's start with your background and experience in home services.",
      enableBackchannel: true,
      interruptionSensitivity: 0.7,
      responsiveness: 0.9,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/retell/webhook`,
    }

    return this.createAgent(config)
  }

  // Helper method to initiate a call with proper error handling
  async initiateCall(params: {
    toNumber: string
    agentId: string
    metadata?: Record<string, any>
    retellLlmDynamicVariables?: Record<string, any>
  }): Promise<CallResponse> {
    const fromNumber = process.env.RETELL_PHONE_NUMBER || "+1234567890"

    return this.createPhoneCall({
      fromNumber,
      toNumber: params.toNumber,
      agentId: params.agentId,
      metadata: {
        ...params.metadata,
        timestamp: new Date().toISOString(),
        source: "tapstead_platform",
      },
      retellLlmDynamicVariables: params.retellLlmDynamicVariables,
    })
  }
}

export const retellService = new RetellAIService()
export default retellService
