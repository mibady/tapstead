import { streamText, CoreTool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { AgentConfig, ConversationContext, UserContext } from './types'
import { validateUserAccess } from './security'
import { logAgentInteraction } from './logging'
import { createServerClient } from '@/lib/supabase/client'

export function createAgentHandler(
  config: AgentConfig,
  systemPrompt: string,
  tools: Record<string, CoreTool>
) {
  return async function handler(req: Request) {
    const startTime = Date.now()
    let success = false
    let toolsUsed: string[] = []

    try {
      const { messages, context }: { 
        messages: any[], 
        context?: ConversationContext 
      } = await req.json()

      // Extract user context from headers or auth
      const userContext = await getUserContext(req)

      // Validate access
      if (config.requiresAuth && !userContext.isAuthenticated) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (config.allowedRoles && userContext.role && !config.allowedRoles.includes(userContext.role)) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Apply rate limiting
      await validateUserAccess(userContext, config)

      // Enhanced system prompt with context
      const enhancedSystemPrompt = `${systemPrompt}

Context:
- User ID: ${userContext.id || 'anonymous'}
- User Role: ${userContext.role || 'customer'}
- Session: ${context?.sessionId || 'new'}

Important Instructions:
- Be helpful, professional, and concise
- If you cannot help with something, explain why and offer alternatives
- For sensitive operations, verify user permissions
- If you encounter errors, provide clear next steps
- Always prioritize user privacy and data security`

      const result = streamText({
        model: openai(config.model),
        system: enhancedSystemPrompt,
        messages,
        tools,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        onFinish: (finishResult) => {
          success = true
          toolsUsed = finishResult.toolCalls?.map(tc => tc.toolName) || []
        }
      })

      // Log the interaction
      await logAgentInteraction({
        agentType: config.name,
        userId: userContext.id,
        success,
        responseTime: Date.now() - startTime,
        toolsUsed
      })

      return result.toDataStreamResponse()
    } catch (error) {
      console.error(`Agent ${config.name} error:`, error)
      
      // Log the failed interaction
      await logAgentInteraction({
        agentType: config.name,
        userId: undefined,
        success: false,
        responseTime: Date.now() - startTime,
        toolsUsed,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      return new Response(
        JSON.stringify({ 
          error: 'Agent temporarily unavailable. Please try again later.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
}

async function getUserContext(req: Request): Promise<UserContext> {
  try {
    // Try to get user from Authorization header first
    const authorization = req.headers.get('authorization')
    
    if (authorization?.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '')
      const supabase = createServerClient()
      
      if (!supabase) {
        return {
          isAuthenticated: false
        }
      }
      
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (user && !error) {
        // Get user role from database
        const { data: profile } = await supabase
          .from('users')
          .select('customer_type')
          .eq('id', user.id)
          .single()
        
        return {
          id: user.id,
          email: user.email!,
          role: profile?.customer_type || 'customer',
          isAuthenticated: true
        }
      }
    }

    // For non-authenticated requests (like recruiting agent), allow anonymous access
    return {
      isAuthenticated: false
    }
  } catch (error) {
    console.error('Error getting user context:', error)
    return {
      isAuthenticated: false
    }
  }
}