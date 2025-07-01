import { AgentConfig } from '../config'
import { supabase } from '@/lib/supabase/client'

const RATE_LIMIT_WINDOW = 60000 // 1 minute
const DEFAULT_REQUESTS_PER_WINDOW = 20

export async function rateLimiter(key: string, config: AgentConfig): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('rate_limits')
      .select('requests, updated_at')
      .eq('key', key)
      .single()

    const now = Date.now()
    const maxRequests = config.rateLimiting?.requests || DEFAULT_REQUESTS_PER_WINDOW
    const windowMs = config.rateLimiting?.windowMs || RATE_LIMIT_WINDOW
    
    if (!data) {
      // First request for this key
      await supabase
        .from('rate_limits')
        .insert({
          key,
          requests: 1,
          updated_at: new Date(now).toISOString()
        })
      return true
    }

    const timeSinceLastRequest = now - new Date(data.updated_at).getTime()
    
    if (timeSinceLastRequest > windowMs) {
      // Window expired, reset counter
      await supabase
        .from('rate_limits')
        .update({
          requests: 1,
          updated_at: new Date(now).toISOString()
        })
        .eq('key', key)
      return true
    }

    if (data.requests >= maxRequests) {
      return false // Rate limit exceeded
    }

    // Increment request count
    await supabase
      .from('rate_limits')
      .update({
        requests: data.requests + 1,
        updated_at: new Date(now).toISOString()
      })
      .eq('key', key)
    
    return true

  } catch (error) {
    console.error('Rate limiter error:', error)
    return true // Allow request if rate limiting fails
  }
}

export function validateToolExecution(
  toolName: string,
  params: unknown,
  userContext: UserContext
): boolean {
  // Validate tool execution permissions
  const sensitiveTools = [
    'query_database',
    'update_provider_status',
    'access_financial_data'
  ]
  
  if (sensitiveTools.includes(toolName)) {
    if (!userContext.isAuthenticated) {
      return false
    }
    
    if (toolName === 'query_database' && userContext.role !== 'admin') {
      return false
    }
  }
  
  return true
}

export function sanitizeInput(input: string): string {
  // Basic input sanitization
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}