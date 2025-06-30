import { AgentConfig, UserContext } from './types'

// Simple in-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function validateUserAccess(
  userContext: UserContext,
  config: AgentConfig
): Promise<void> {
  const key = `${userContext.id || 'anonymous'}-${config.name}`
  const now = Date.now()
  
  const existing = rateLimitStore.get(key)
  
  if (existing) {
    if (now < existing.resetTime) {
      if (existing.count >= config.rateLimiting.requests) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      existing.count++
    } else {
      // Reset window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.rateLimiting.windowMs
      })
    }
  } else {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.rateLimiting.windowMs
    })
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