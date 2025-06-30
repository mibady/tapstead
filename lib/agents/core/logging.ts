import { createServerClient } from '@/lib/supabase/client'

interface AgentInteractionLog {
  agentType: string
  userId?: string
  sessionId?: string
  success: boolean
  responseTime: number
  toolsUsed: string[]
  error?: string
  userInput?: string
  agentResponse?: string
}

export async function logAgentInteraction(log: AgentInteractionLog): Promise<void> {
  try {
    // Log to console for debugging
    console.log('Agent Interaction:', {
      timestamp: new Date().toISOString(),
      ...log
    })
    
    // Log to database
    const supabase = createServerClient()
    
    if (!supabase) {
      console.error('Failed to create Supabase client for logging')
      return
    }
    
    const { error } = await supabase
      .from('agent_interactions')
      .insert({
        agent_type: log.agentType,
        user_id: log.userId,
        session_id: log.sessionId,
        tool_used: log.toolsUsed.length > 0 ? log.toolsUsed[0] : null,
        success: log.success,
        response_time_ms: log.responseTime,
        error_message: log.error,
        user_input: log.userInput,
        agent_response: log.agentResponse
      })
    
    if (error) {
      console.error('Failed to log to database:', error)
    }
  } catch (error) {
    console.error('Failed to log agent interaction:', error)
  }
}

export async function logToolExecution(
  agentType: string,
  toolName: string,
  userId?: string,
  success: boolean = true,
  responseTime: number = 0
): Promise<void> {
  console.log('Tool Execution:', {
    timestamp: new Date().toISOString(),
    agentType,
    toolName,
    userId,
    success,
    responseTime
  })
}