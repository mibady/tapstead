interface RetellCallRequest {
  agent_id: string
  phone_number: string
  from_number?: string
  metadata?: Record<string, any>
  retell_llm_dynamic_variables?: Record<string, any>
}

interface RetellCallResponse {
  call_id: string
  agent_id: string
  call_status: string
  phone_number: string
  start_timestamp: number
  end_timestamp?: number
  call_type: string
}

class RetellClient {
  private apiKey: string
  private baseUrl = 'https://api.retellai.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createPhoneCall(request: RetellCallRequest): Promise<RetellCallResponse> {
    const response = await fetch(`${this.baseUrl}/create-phone-call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Retell API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getCall(callId: string): Promise<RetellCallResponse> {
    const response = await fetch(`${this.baseUrl}/get-call/${callId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Retell API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async listCalls(limit: number = 10, cursor?: string): Promise<{ calls: RetellCallResponse[], cursor?: string }> {
    const params = new URLSearchParams({ limit: limit.toString() })
    if (cursor) params.append('cursor', cursor)

    const response = await fetch(`${this.baseUrl}/list-calls?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Retell API error: ${response.status} - ${error}`)
    }

    return response.json()
  }
}

// Initialize Retell client
export const retellClient = new RetellClient(process.env.RETELL_API_KEY!)

// Helper functions for common operations
export async function initiateBookingCall(
  customerPhoneNumber: string,
  serviceType?: string,
  urgency?: 'normal' | 'urgent' | 'emergency'
): Promise<RetellCallResponse> {
  const dynamicVariables = {
    customer_phone: customerPhoneNumber,
    service_type: serviceType || 'general_inquiry',
    urgency_level: urgency || 'normal',
    company_name: 'Tapstead',
    business_hours: 'Monday-Sunday 9AM-6PM',
    emergency_available: urgency === 'emergency' ? 'true' : 'false'
  }

  return retellClient.createPhoneCall({
    agent_id: process.env.RETELL_AGENT_ID!,
    phone_number: customerPhoneNumber,
    from_number: process.env.RETELL_PHONE_NUMBER,
    metadata: {
      source: 'tapstead_booking_agent',
      service_type: serviceType,
      urgency,
      timestamp: new Date().toISOString()
    },
    retell_llm_dynamic_variables: dynamicVariables
  })
}

export async function initiateEmergencyCall(
  customerPhoneNumber: string,
  emergencyType: string
): Promise<RetellCallResponse> {
  const dynamicVariables = {
    customer_phone: customerPhoneNumber,
    service_type: 'emergency_service',
    emergency_type: emergencyType,
    urgency_level: 'emergency',
    company_name: 'Tapstead Emergency Services',
    response_time: 'within 1-2 hours',
    emergency_available: 'true',
    priority_routing: 'true'
  }

  return retellClient.createPhoneCall({
    agent_id: process.env.RETELL_AGENT_ID!,
    phone_number: customerPhoneNumber,
    from_number: process.env.RETELL_PHONE_NUMBER,
    metadata: {
      source: 'tapstead_emergency',
      emergency_type: emergencyType,
      urgency: 'emergency',
      timestamp: new Date().toISOString(),
      priority: 'high'
    },
    retell_llm_dynamic_variables: dynamicVariables
  })
}

// Call routing logic
export function determineCallRouting(serviceType: string, urgency: string) {
  const isEmergency = urgency === 'emergency' || 
    serviceType.includes('emergency') || 
    serviceType.includes('disaster')
    
  return {
    isEmergency,
    agentId: process.env.RETELL_AGENT_ID!,
    fromNumber: process.env.RETELL_PHONE_NUMBER!,
    priority: isEmergency ? 'high' : 'normal',
    estimatedResponseTime: isEmergency ? '1-2 hours' : '2-4 hours'
  }
}

export { RetellClient, type RetellCallRequest, type RetellCallResponse }