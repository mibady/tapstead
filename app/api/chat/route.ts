import { createServerClient } from '@/lib/supabase/client'
import { agentConfigs } from '@/lib/agents/config'
import { createChatConversation, saveChatMessage, saveFunctionCall } from '@/lib/supabase/chat'
import Anthropic from '@anthropic-ai/sdk'
import { streamToResponse } from 'ai'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req: Request) {
  try {
    // Get user context first
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Parse request body
    const { messages, agentType, conversationId } = await req.json()
    
    if (!agentType || !messages) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      )
    }

    // Get agent config
    const agentConfig = agentConfigs[agentType]
    if (!agentConfig) {
      return new Response(
        JSON.stringify({ error: 'Invalid agent type' }),
        { status: 400 }
      )
    }

    // Handle conversation ID
    let chatId = conversationId
    if (!chatId && user) {
      const conversation = await createChatConversation(user.id, agentType)
      chatId = conversation.id
    }

    // Add user context to system message
    const systemMessage = `${agentConfig.systemPrompt}\n\nUser Context:\n${user ? `- Logged in as: ${user.email}\n- User ID: ${user.id}` : '- Anonymous user'}`

    // Create Anthropic message stream
    const stream = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: agentConfig.maxTokens || 1024,
      temperature: agentConfig.temperature || 0.7,
      system: systemMessage,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      stream: true
    })

    // Convert Anthropic stream to Web API stream
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_start' || chunk.type === 'content_block_delta') {
              const text = chunk.delta?.text || ''
              controller.enqueue(new TextEncoder().encode(text))

              // Save message chunk if we have a conversation ID
              if (chatId && text.trim()) {
                await saveChatMessage({
                  conversationId: chatId,
                  role: 'assistant',
                  content: text
                })
              }
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return more specific error messages
    if (error instanceof Anthropic.APIError) {
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 503 }
      )
    }
    
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500 }
    )
  }
}