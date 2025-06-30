import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'
import { AgentConfig } from './core/types'
import { validateUserAccess } from './core/security'

export async function withAgentAuth(
  req: NextRequest,
  config: AgentConfig,
  handler: (req: Request) => Promise<Response>
): Promise<Response> {
  try {
    // Get user context
    const userContext = await getUserContextFromRequest(req)
    
    // Check authentication requirements
    if (config.requiresAuth && !userContext.isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check role permissions
    if (config.allowedRoles && userContext.role && !config.allowedRoles.includes(userContext.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Apply rate limiting
    await validateUserAccess(userContext, config)
    
    // Add user context to request headers for the handler
    const headers = new Headers(req.headers)
    headers.set('x-user-id', userContext.id || '')
    headers.set('x-user-email', userContext.email || '')
    headers.set('x-user-role', userContext.role || 'anonymous')
    headers.set('x-user-authenticated', userContext.isAuthenticated.toString())
    
    const modifiedRequest = new Request(req, { headers })
    
    return await handler(modifiedRequest)
  } catch (error: any) {
    console.error('Agent middleware error:', error)
    
    if (error.message.includes('Rate limit')) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: 'Agent temporarily unavailable' },
      { status: 500 }
    )
  }
}

async function getUserContextFromRequest(req: NextRequest) {
  try {
    // Try to get user from Authorization header
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
    
    // Try to get user from session cookies (for browser requests)
    const supabase = createServerClient()
    
    if (!supabase) {
      return {
        isAuthenticated: false
      }
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
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

    // Anonymous user
    return {
      isAuthenticated: false
    }
  } catch (error) {
    console.error('Error getting user context from request:', error)
    return {
      isAuthenticated: false
    }
  }
}

export function createAuthenticatedAgentHandler(
  config: AgentConfig,
  systemPrompt: string,
  tools: Record<string, any>
) {
  const { createAgentHandler } = require('./core/handler')
  const baseHandler = createAgentHandler(config, systemPrompt, tools)
  
  return async function authenticatedHandler(req: NextRequest) {
    return withAgentAuth(req, config, baseHandler)
  }
}