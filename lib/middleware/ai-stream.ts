import { AIStream, streamToResponse } from 'ai'
import { createServerClient } from '@/lib/supabase/client'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10s'),
})

export async function aiStreamMiddleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  if (!success) {
    return new NextResponse('Rate limit exceeded', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    })
  }

  return NextResponse.next()
}

type AIStreamCallbacks = {
  onStart?: () => Promise<void> | void
  onToken?: (token: string) => Promise<void> | void
  onCompletion?: (completion: string) => Promise<void> | void
  onFinal?: (completion: string) => Promise<void> | void
}

export function createEnhancedStream(
  response: Response,
  callbacks?: AIStreamCallbacks
) {
  // Rate limiting state
  let tokenCount = 0
  let lastTokenTimestamp = Date.now()
  const TOKEN_RATE_LIMIT = 100 // tokens per second

  // Create enhanced parser with rate limiting and error handling
  const enhancedParser = async (data: string): Promise<string> => {
    try {
      // Basic rate limiting
      const now = Date.now()
      const timeSinceLastToken = now - lastTokenTimestamp
      const allowedTokens = (timeSinceLastToken / 1000) * TOKEN_RATE_LIMIT

      if (tokenCount > allowedTokens) {
        await new Promise(resolve => 
          setTimeout(resolve, (tokenCount - allowedTokens) * (1000 / TOKEN_RATE_LIMIT))
        )
      }

      tokenCount++
      lastTokenTimestamp = now

      return data
    } catch (error) {
      console.error('Stream parser error:', error)
      throw error
    }
  }

  // Create AI stream with enhanced callbacks
  const stream = AIStream(response, enhancedParser)

  // Add error handling wrapper
  const wrappedStream = new TransformStream({
    async transform(chunk, controller) {
      try {
        controller.enqueue(chunk)
      } catch (error) {
        console.error('Stream transform error:', error)
        controller.error(error)
      }
    }
  })

  // Pipe through error handler
  stream.pipeThrough(wrappedStream)

  return streamToResponse(stream)
}

export async function withAIStreamAuth(req: Request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check rate limits in Supabase
    const { data: rateLimits } = await supabase
      .from('user_rate_limits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (rateLimits?.remaining_requests === 0) {
      throw new Error('Rate limit exceeded')
    }

    // Update rate limits
    await supabase
      .from('user_rate_limits')
      .update({
        remaining_requests: rateLimits ? rateLimits.remaining_requests - 1 : 99,
        last_request: new Date().toISOString()
      })
      .eq('user_id', user.id)

    return { user }
  } catch (error) {
    console.error('AI stream auth error:', error)
    throw error
  }
}