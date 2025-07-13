interface CallRequest {
  fromNumber: string
  toNumber: string
  agentId: string
  metadata?: Record<string, any>
}

interface CallResponse {
  callId: string
  status: string
}

interface SMSRequest {
  to: string
  message: string
  from?: string
}

interface SMSResponse {
  messageId: string
  status: string
}

interface AgentConfig {
  name: string
  voice: string
  language: string
  prompt: string
  firstMessage: string
  enableRecording: boolean
  responseDelay: number
}

class RetellService {
  private apiKey: string
  private baseUrl: string
  private defaultFromNumber: string

  constructor() {
    this.apiKey = process.env.RETELL_API_KEY || ""
    this.baseUrl = "https://api.retellai.com/v2"
    this.defaultFromNumber = process.env.RETELL_PHONE_NUMBER || "+1234567890"
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Retell API error: ${response.statusText}`)
    }

    return response.json()
  }

  async initiateCall(callRequest: CallRequest): Promise<CallResponse> {
    const payload = {
      from_number: callRequest.fromNumber,
      to_number: callRequest.toNumber,
      agent_id: callRequest.agentId,
      metadata: {
        ...callRequest.metadata,
        timestamp: new Date().toISOString(),
      },
    }

    return this.makeRequest("/call", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async sendSMS(smsRequest: SMSRequest): Promise<SMSResponse> {
    const payload = {
      to: smsRequest.to,
      from: smsRequest.from || this.defaultFromNumber,
      body: smsRequest.message,
    }

    return this.makeRequest("/sms", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async getCallDetails(callId: string) {
    return this.makeRequest(`/call/${callId}`)
  }

  async endCall(callId: string) {
    return this.makeRequest(`/call/${callId}/end`, {
      method: "POST",
    })
  }

  // Agent Configurations
  getBookingAgent(): AgentConfig {
    return {
      name: "Tapstead Booking Assistant",
      voice: "11labs-Adrian",
      language: "en-US",
      prompt: `You are a helpful booking assistant for Tapstead, a home services platform. 
      Your role is to help customers book house cleaning services and other home services.
      
      Key information:
      - House cleaning pricing: Small ($149), Medium ($199), Large ($299)
      - Subscription discounts: Weekly (33% off), Bi-weekly (27% off), Monthly (20% off)
      - Available services: House cleaning, plumbing, electrical, handyman, painting
      - Service areas: Major metropolitan areas
      
      Always be friendly, professional, and helpful. Ask clarifying questions to understand
      the customer's needs and guide them through the booking process.`,
      firstMessage:
        "Hi! I'm here to help you book home services with Tapstead. What service are you interested in today?",
      enableRecording: true,
      responseDelay: 800,
    }
  }

  getSupportAgent(): AgentConfig {
    return {
      name: "Tapstead Support Agent",
      voice: "11labs-Rachel",
      language: "en-US",
      prompt: `You are a customer support agent for Tapstead. Your role is to help customers
      with questions, concerns, and issues related to their bookings and services.
      
      Common issues you can help with:
      - Booking modifications and cancellations
      - Service quality concerns
      - Payment and billing questions
      - Provider communication issues
      - General platform questions
      
      Always be empathetic, solution-focused, and professional. If you cannot resolve
      an issue, escalate to a human agent.`,
      firstMessage:
        "Hello! I'm here to help with any questions or concerns about your Tapstead experience. How can I assist you today?",
      enableRecording: true,
      responseDelay: 600,
    }
  }

  getRecruitingAgent(): AgentConfig {
    return {
      name: "Tapstead Provider Recruiter",
      voice: "11labs-Josh",
      language: "en-US",
      prompt: `You are a recruiting agent for Tapstead, helping to onboard new service providers.
      Your role is to screen potential providers and guide them through the application process.
      
      Key requirements for providers:
      - Valid business license and insurance
      - Minimum 2 years experience in their service area
      - Background check clearance
      - Professional references
      - Commitment to quality service standards
      
      Be professional, thorough, and encouraging while maintaining high standards.`,
      firstMessage:
        "Welcome to Tapstead! I'm excited to learn about your interest in joining our provider network. Let's start with your background and experience.",
      enableRecording: true,
      responseDelay: 700,
    }
  }

  async createAgent(config: AgentConfig) {
    return this.makeRequest("/agent", {
      method: "POST",
      body: JSON.stringify({
        agent_name: config.name,
        voice_id: config.voice,
        language: config.language,
        response_engine: {
          type: "retell-llm",
          llm_websocket_url: "wss://your-websocket-url",
        },
        agent_prompt: config.prompt,
        begin_message: config.firstMessage,
        enable_recording: config.enableRecording,
        response_delay: config.responseDelay,
      }),
    })
  }
}

export const retellService = new RetellService()
