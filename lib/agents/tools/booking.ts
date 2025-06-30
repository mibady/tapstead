import { type ChatCompletionCreateParams } from 'openai/resources/chat'
import { createServerClient } from '@/lib/supabase/client'
import { calculateQuote } from '@/lib/pricing/calculator'

export const bookingTools: ChatCompletionCreateParams.Function[] = [
  {
    name: 'checkAvailability',
    description: 'Check service provider availability for a given date and service',
    parameters: {
      type: 'object',
      required: ['service', 'date'],
      properties: {
        service: {
          type: 'string',
          enum: ['cleaning', 'plumbing', 'electrical', 'handyman']
        },
        date: {
          type: 'string',
          format: 'date'
        }
      }
    }
  },
  {
    name: 'getQuote',
    description: 'Generate a price quote for a service',
    parameters: {
      type: 'object',
      required: ['service', 'details'],
      properties: {
        service: {
          type: 'string',
          enum: ['cleaning', 'plumbing', 'electrical', 'handyman']
        },
        details: {
          type: 'object',
          properties: {
            squareFootage: { type: 'number' },
            bedrooms: { type: 'number' },
            bathrooms: { type: 'number' }
          }
        }
      }
    }
  },
  {
    name: 'requestCallback',
    description: 'Schedule a callback for the user',
    parameters: {
      type: 'object',
      required: ['phone', 'topic'],
      properties: {
        phone: { type: 'string' },
        topic: { type: 'string' },
        preferredTime: { type: 'string' }
      }
    }
  }
]

export const bookingHandlers = {
  async checkAvailability({ service, date }: { service: string, date: string }) {
    const supabase = createServerClient()
    
    const { data: providers } = await supabase
      .from('provider_availability')
      .select('*')
      .eq('service_type', service)
      .gte('available_date', date)
      .limit(5)
    
    return {
      available: providers && providers.length > 0,
      nextAvailable: providers?.[0]?.available_date,
      providers: providers?.length
    }
  },

  async getQuote({ service, details }: { 
    service: string, 
    details: { squareFootage: number, bedrooms: number, bathrooms: number }
  }) {
    const quote = await calculateQuote(service, details)
    return {
      basePrice: quote.basePrice,
      adjustments: quote.adjustments,
      final: quote.finalPrice,
      currency: 'USD'
    }
  },

  async requestCallback({ phone, topic, preferredTime }: {
    phone: string
    topic: string
    preferredTime?: string
  }) {
    const supabase = createServerClient()
    
    const { data: callback } = await supabase
      .from('callbacks')
      .insert({
        phone,
        topic,
        preferred_time: preferredTime,
        status: 'pending'
      })
      .select()
      .single()
    
    return {
      scheduled: true,
      callbackId: callback?.id,
      message: 'We will call you back as soon as possible'
    }
  }
}
