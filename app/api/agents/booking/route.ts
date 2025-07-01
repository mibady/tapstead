import { streamToResponse, Message } from 'ai'
import { Anthropic } from '@anthropic-ai/sdk'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/client'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// System prompt
const systemPrompt = `You are a helpful booking assistant for Tapstead. Help customers find and book services while being friendly and professional.

Key Points:
• Get service requirements before quoting
• Check availability before booking
• Be clear about pricing and policies
• Guide customers step by step
• Offer phone support when needed

Available services:
• House cleaning
• Handyman services
• Plumbing
• Electrical work
• Painting
• Pressure washing
• Gutter services
• Junk removal
• Emergency services

Remember:
• Licensed and insured providers
• Free cancellation up to 4 hours before
• Payment after service completion
• 24/7 phone support at (360) 641-7386`

// Input validation schema
const MessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  name: z.string().optional(),
  function_call: z.any().optional()
})

const RequestSchema = z.object({
  messages: z.array(MessageSchema),
  functions: z.array(z.any()).optional(),
  function_call: z.any().optional()
})

// Rate limiting configuration
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const supabase = createServerClient()
    const key = `rate_limit:chat:${ip}`
    const { data: rateLimit } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .single()

    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    const maxRequests = 20 // 20 requests per minute

    if (!rateLimit) {
      // Create new rate limit entry
      await supabase
        .from('rate_limits')
        .insert({
          key,
          count: 1,
          reset_at: new Date(now + windowMs).toISOString()
        })
      return true
    }

    const resetAt = new Date(rateLimit.reset_at).getTime()
    if (now > resetAt) {
      // Reset rate limit
      await supabase
        .from('rate_limits')
        .update({
          count: 1,
          reset_at: new Date(now + windowMs).toISOString()
        })
        .eq('key', key)
      return true
    }

    if (rateLimit.count >= maxRequests) {
      return false
    }

    // Increment count
    await supabase
      .from('rate_limits')
      .update({ count: rateLimit.count + 1 })
      .eq('key', key)
    return true

  } catch (error) {
    console.error('Rate limit error:', error)
    // Fail open
    return true
  }
}

export async function POST(req: Request) {
  try {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    
    // Check rate limit
    const allowed = await checkRateLimit(ip)
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many requests' }),
        { status: 429 }
      )
    }

    // Parse and validate request
    const body = await req.json()
    const result = RequestSchema.safeParse(body)
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: result.error.format() }),
        { status: 400 }
      )
    }

    // Create stream
    const response = await anthropic.messages.create({
      messages: result.data.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      stream: true
    })

    // Convert to stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.type === 'content_block_delta') {
              const text = chunk.delta?.text || ''
              if (text) {
                const data = JSON.stringify({ role: 'assistant', content: text })
                controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
              }
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      }
    })

    // Return streaming response
    return streamToResponse(stream)

  } catch (error) {
    console.error('Booking agent error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    )
  }
}