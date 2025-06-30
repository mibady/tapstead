export interface AgentConfig {
  name: string
  description: string
  model: string
  temperature: number
  maxTokens: number
  allowedRoles?: string[]
  requiresAuth: boolean
  rateLimiting: {
    requests: number
    windowMs: number
  }
}

export interface ConversationContext {
  userId?: string
  sessionId: string
  agentType: string
  userRole?: string
  contextData?: Record<string, any>
}

export interface AgentMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  toolCalls?: any[]
}

export interface AgentResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
  escalateToHuman?: boolean
}

export interface UserContext {
  id?: string
  email?: string
  role?: string
  isAuthenticated: boolean
}