import { AgentConfig } from './core/types'

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  recruiting: {
    name: 'recruiting',
    description: 'Helps prospective contractors through the application process',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    requiresAuth: false,
    rateLimiting: {
      requests: 20,
      windowMs: 60000 // 1 minute
    }
  },
  booking: {
    name: 'booking',
    description: 'Assists customers with service bookings and quotes',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    requiresAuth: false,
    rateLimiting: {
      requests: 30,
      windowMs: 60000
    }
  },
  support: {
    name: 'support',
    description: 'Provides customer support and answers questions',
    model: 'gpt-4o-mini',
    temperature: 0.6,
    maxTokens: 1500,
    requiresAuth: true,
    rateLimiting: {
      requests: 25,
      windowMs: 60000
    }
  },
  provider: {
    name: 'provider',
    description: 'Helps providers manage their work and communications',
    model: 'gpt-4o-mini',
    temperature: 0.6,
    maxTokens: 1500,
    allowedRoles: ['provider', 'admin'],
    requiresAuth: true,
    rateLimiting: {
      requests: 40,
      windowMs: 60000
    }
  },
  analytics: {
    name: 'analytics',
    description: 'Provides business analytics and insights',
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 2500,
    allowedRoles: ['admin'],
    requiresAuth: true,
    rateLimiting: {
      requests: 15,
      windowMs: 60000
    }
  }
}