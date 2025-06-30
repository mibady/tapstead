import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createServerClient } from '@/lib/supabase/client'
import { agentConfigs } from '@/lib/agents/config'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { messages, agentType } = await req.json()
    const agentConfig = agentConfigs[agentType]

    // Get user context
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Add user context to system message
    const systemMessage = `${agentConfig.systemPrompt}\n\nUser Context:\n${user ? `- Logged in as: ${user.email}\n- User ID: ${user.id}` : '- Anonymous user'}`

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages
      ],
      functions: agentConfig.tools,
      stream: true
    })

    // Handle function calls
    if (response.choices[0]?.delta?.function_call) {
      const functionCall = response.choices[0].delta.function_call
      const handler = agentConfig.handlers[functionCall.name]
      
      try {
        const result = await handler(JSON.parse(functionCall.arguments))
        
        // Add function result to messages
        messages.push({
          role: 'function',
          name: functionCall.name,
          content: JSON.stringify(result)
        })
        
        // Get AI response to function result
        return openai.createChatCompletion({
          model: 'gpt-4',
          messages,
          stream: true
        })
      } catch (error) {
        console.error(`Error executing function ${functionCall.name}:`, error)
        messages.push({
          role: 'function',
          name: functionCall.name,
          content: JSON.stringify({ error: 'Function execution failed' })
        })
      }
    }

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        // Save completion to database
        if (user) {
          const supabase = createServerClient()
          await supabase.from('chat_completions').insert({
            user_id: user.id,
            agent_type: agentType,
            completion,
            token_count: completion.length / 4 // Rough estimation
          })
        }
      },
      onToken(token) {
        // Could implement token-level rate limiting here
        console.log('Token:', token)
      }
    })

    const enhancedStream = createEnhancedStream(response, {
      onStart: async () => {
        console.log('Stream started')
      },
      onToken: async (token) => {
        // Implement token-level processing if needed
      },
      onCompletion: async (completion) => {
        console.log('Stream completed')
      }
    })

    return enhancedStream
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500 }
    )
  }
}
