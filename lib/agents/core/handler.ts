import Anthropic from '@anthropic-ai/sdk'
import { StreamingTextResponse } from 'ai'
import { supabase } from '@/lib/supabase/client'
import { AgentConfig } from '../config'
import { rateLimiter } from './security'
import { logInteraction } from './logging'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export const createAgentHandler = (
  config: AgentConfig,
  systemPrompt: string,
  tools: any[]
) => {
  return async function handler(req: Request) {
    try {
      // Parse request
      const { messages, context } = await req.json()
      const { sessionId, userId } = context || {}

      // Rate limiting check
      const rateLimitKey = userId || req.headers.get('x-forwarded-for') || 'anonymous'
      const canProceed = await rateLimiter(rateLimitKey, config)
      if (!canProceed) {
        return new Response('Rate limit exceeded', { status: 429 })
      }

      // Auth check if required
      if (config.requiresAuth && !userId) {
        return new Response('Authentication required', { status: 401 })
      }

      // Role check if specified
      if (config.allowedRoles?.length > 0) {
        const { data: user } = await supabase.auth.getUser(userId)
        if (!user || !config.allowedRoles.includes(user.user?.user_metadata?.role)) {
          return new Response('Unauthorized', { status: 403 })
        }
      }

      // Create or get conversation
      let conversationId = sessionId
      if (!conversationId) {
        const { data: conv } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: userId,
            agent_type: config.name
          })
          .select()
          .single()
        conversationId = conv?.id
      }

      // Store messages
      if (conversationId) {
        await supabase.from('chat_messages').insert(
          messages.map((m: any) => ({
            conversation_id: conversationId,
            role: m.role,
            content: m.content
          }))
        )
      }

      // Create completion request
      const fullSystemPrompt = `${systemPrompt}\n\nAvailable tools:\n${JSON.stringify(tools, null, 2)}`
      
      const startTime = Date.now()
      const response = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: config.maxTokens || 1024,
        temperature: config.temperature || 0.7,
        system: fullSystemPrompt,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        tools: tools.map(t => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters
        })),
        stream: true
      })

      // Log interaction
      const latencyMs = Date.now() - startTime
      await logInteraction({
        conversationId,
        agentType: config.name,
        toolName: 'chat_completion',
        success: true,
        latencyMs
      })

      // Convert Anthropic stream to ReadableStream
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              if (chunk.type === 'content_block_delta' && chunk.delta.text) {
                controller.enqueue(new TextEncoder().encode(chunk.delta.text))
              }
            }
            controller.close()
          } catch (error) {
            controller.error(error)
          }
        }
      })

      // Return streaming response
      return new StreamingTextResponse(stream)

    } catch (error) {
      console.error('Agent handler error:', error)
      return new Response('Internal server error', { status: 500 })
    }
  }
}