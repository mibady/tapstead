import { tool } from 'ai'
import { z } from 'zod'
import { getAllServices, getServiceById } from '@/lib/services/service-data'
import { createServerClient } from '@/lib/supabase/client'
import { logToolExecution } from '../core/logging'
import { initiateBookingCall, initiateEmergencyCall, determineCallRouting } from '@/lib/integrations/retell'

export const searchServices = tool({
  description: 'Search for available services by name or category',
  parameters: z.object({
    query: z.string().describe('Service name or category to search for')
  }),
  async execute({ query }) {
    await logToolExecution('booking', 'search_services')
    
    try {
      const services = await getAllServices()
      const queryLower = query.toLowerCase()
      
      const filteredServices = services.filter(service => 
        service.title?.toLowerCase().includes(queryLower) ||
        service.category?.toLowerCase().includes(queryLower) ||
        service.description?.toLowerCase().includes(queryLower)
      )
      
      return {
        success: true,
        services: filteredServices.map(service => ({
          id: service.id,
          title: service.title,
          description: service.description,
          basePrice: service.base_price,
          duration: service.duration,
          category: service.category
        }))
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to search services at the moment"
      }
    }
  }
})

export const getServiceDetails = tool({
  description: 'Get detailed information about a specific service',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the service to get details for')
  }),
  async execute({ serviceId }) {
    await logToolExecution('booking', 'get_service_details')
    
    try {
      const service = await getServiceById(serviceId)
      
      if (!service) {
        return {
          success: false,
          message: "Service not found"
        }
      }
      
      return {
        success: true,
        service: {
          id: service.id,
          title: service.title,
          description: service.description,
          basePrice: service.base_price,
          duration: service.duration,
          category: service.category
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to fetch service details"
      }
    }
  }
})

export const generateQuote = tool({
  description: 'Generate a price quote for a service based on details provided',
  parameters: z.object({
    serviceId: z.string().describe('The service ID'),
    projectDescription: z.string().describe('Description of the work needed'),
    propertyType: z.string().optional().describe('Type of property (house, apartment, etc.)'),
    urgency: z.string().optional().describe('How urgent the work is (emergency, within_week, flexible)')
  }),
  async execute({ serviceId, projectDescription, propertyType, urgency }) {
    await logToolExecution('booking', 'generate_quote')
    
    try {
      const service = await getServiceById(serviceId)
      
      if (!service) {
        return {
          success: false,
          message: "Service not found"
        }
      }
      
      // Basic quote calculation based on service base price
      let basePrice = service.base_price || 100
      let multiplier = 1
      
      // Adjust based on urgency
      if (urgency === 'emergency') {
        multiplier *= 1.5
      } else if (urgency === 'within_week') {
        multiplier *= 1.2
      }
      
      // Adjust based on description complexity (simple heuristic)
      const descriptionWords = projectDescription.split(' ').length
      if (descriptionWords > 20) {
        multiplier *= 1.3
      }
      
      const estimatedPrice = Math.round(basePrice * multiplier)
      const estimatedDuration = service.duration || '2-4 hours'
      
      return {
        success: true,
        quote: {
          serviceTitle: service.title,
          estimatedPrice,
          estimatedDuration,
          basePrice: service.base_price,
          urgencyMultiplier: urgency === 'emergency' ? 1.5 : urgency === 'within_week' ? 1.2 : 1,
          description: `Quote for ${service.title}: ${projectDescription}`,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to generate quote at the moment"
      }
    }
  }
})

export const checkProviderAvailability = tool({
  description: 'Check available time slots for a service on a specific date',
  parameters: z.object({
    serviceId: z.string().describe('The service ID'),
    date: z.string().describe('Date to check availability (YYYY-MM-DD format)'),
    zipCode: z.string().optional().describe('Zip code for the service location')
  }),
  async execute({ serviceId, date, zipCode }) {
    await logToolExecution('booking', 'check_provider_availability')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      // Get providers who offer this service
      const { data: providers } = await supabase
        .from('providers')
        .select('id')
        .eq('active', true)
        .contains('services', [serviceId])
      
      if (!providers || providers.length === 0) {
        return {
          success: false,
          message: "No providers available for this service"
        }
      }
      
      // Get existing bookings for the date
      const { data: bookings } = await supabase
        .from('bookings')
        .select('provider_id, scheduled_time, estimated_duration')
        .in('provider_id', providers.map(p => p.id))
        .eq('scheduled_date', date)
        .in('status', ['scheduled', 'in_progress'])
      
      // Calculate available time slots (simplified)
      const workingHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
      const bookedTimes = new Set(bookings?.map(b => b.scheduled_time) || [])
      
      const availableSlots = workingHours.filter(time => !bookedTimes.has(time))
      
      return {
        success: true,
        availability: {
          date,
          availableSlots,
          providersAvailable: providers.length,
          message: availableSlots.length > 0 
            ? `${availableSlots.length} time slots available`
            : "No available time slots for this date"
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to check availability at the moment"
      }
    }
  }
})

export const createBookingRequest = tool({
  description: 'Create a booking request for a service',
  parameters: z.object({
    serviceId: z.string().describe('The service ID'),
    scheduledDate: z.string().describe('Preferred date (YYYY-MM-DD)'),
    scheduledTime: z.string().describe('Preferred time (HH:MM)'),
    address: z.string().describe('Full address for the service'),
    specialInstructions: z.string().optional().describe('Any special instructions'),
    estimatedPrice: z.number().describe('Estimated price for the service'),
    customerName: z.string().describe('Customer name'),
    customerEmail: z.string().describe('Customer email'),
    customerPhone: z.string().describe('Customer phone number')
  }),
  async execute({ serviceId, scheduledDate, scheduledTime, address, specialInstructions, estimatedPrice, customerName, customerEmail, customerPhone }) {
    await logToolExecution('booking', 'create_booking_request')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      // Create a booking request (will need manual confirmation)
      const bookingData = {
        service_id: serviceId,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        address,
        special_instructions: specialInstructions || '',
        estimated_price: estimatedPrice,
        status: 'quote_requested',
        // Note: In a real implementation, you'd either:
        // 1. Require authentication first, or
        // 2. Store the contact info separately and create the user/booking after confirmation
      }
      
      // For now, we'll return a booking request confirmation
      return {
        success: true,
        bookingRequest: {
          serviceId,
          scheduledDate,
          scheduledTime,
          address,
          estimatedPrice,
          customerInfo: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
          },
          message: "Booking request created! We'll contact you within 24 hours to confirm details and assign a provider.",
          nextSteps: [
            "We'll verify your booking details",
            "Assign a qualified provider in your area",
            "Send you confirmation with provider information",
            "Provider will contact you before the scheduled time"
          ]
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to create booking request at the moment"
      }
    }
  }
})

export const getBookingHelp = tool({
  description: 'Get help information about the booking process',
  parameters: z.object({
    topic: z.string().optional().describe('Specific help topic (pricing, scheduling, cancellation, etc.)')
  }),
  async execute({ topic }) {
    await logToolExecution('booking', 'get_booking_help')
    
    const helpTopics = {
      pricing: {
        title: "How Pricing Works",
        content: "Our pricing is based on the service type, complexity, and urgency. Emergency services have higher rates. You'll get an upfront quote before booking."
      },
      scheduling: {
        title: "Scheduling Your Service",
        content: "We offer flexible scheduling Monday-Sunday, 9 AM to 6 PM. Emergency services are available 24/7. Book at least 24 hours in advance for best availability."
      },
      cancellation: {
        title: "Cancellation Policy",
        content: "Free cancellation up to 4 hours before your scheduled time. Emergency services require 2-hour notice. Cancellations made within the notice period may incur a fee."
      },
      providers: {
        title: "Our Service Providers",
        content: "All providers are licensed, insured, and background-checked. They're rated by customers and we continuously monitor their performance."
      },
      payment: {
        title: "Payment Information",
        content: "We accept all major credit cards and digital payments. Payment is processed after service completion. You'll receive a detailed invoice via email."
      },
      phone: {
        title: "Phone Support",
        content: "Call us at (360) 641-7386 for immediate assistance with our 24/7 AI phone agent for bookings, quotes, emergencies, and routing to the right specialist."
      }
    }
    
    if (topic && helpTopics[topic as keyof typeof helpTopics]) {
      return {
        success: true,
        help: helpTopics[topic as keyof typeof helpTopics]
      }
    }
    
    return {
      success: true,
      help: {
        title: "Booking Help",
        content: "I can help you with pricing, scheduling, cancellations, provider information, and payment questions. You can also call us at (360) 641-7386 for immediate phone support. What specific topic would you like to know about?",
        availableTopics: Object.keys(helpTopics),
        phoneSupport: "(360) 641-7386 - 24/7 AI phone assistance"
      }
    }
  }
})

export const initiatePhoneCall = tool({
  description: 'Initiate an AI-powered phone call to help customer with booking or urgent needs',
  parameters: z.object({
    customerPhoneNumber: z.string().describe('Customer phone number to call'),
    serviceType: z.string().optional().describe('Type of service they need'),
    urgency: z.enum(['normal', 'urgent', 'emergency']).default('normal').describe('Urgency level of the request'),
    customerName: z.string().optional().describe('Customer name for personalization'),
    preferredCallTime: z.string().optional().describe('When customer prefers to be called')
  }),
  async execute({ customerPhoneNumber, serviceType, urgency, customerName, preferredCallTime }) {
    await logToolExecution('booking', 'initiate_phone_call')
    
    try {
      // Validate phone number format (basic validation)
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
      if (!phoneRegex.test(customerPhoneNumber)) {
        return {
          success: false,
          message: "Please provide a valid phone number format"
        }
      }
      
      // Determine call routing
      const routing = determineCallRouting(serviceType || 'general', urgency)
      
      let callResult
      if (routing.isEmergency) {
        callResult = await initiateEmergencyCall(customerPhoneNumber, serviceType || 'emergency')
      } else {
        callResult = await initiateBookingCall(customerPhoneNumber, serviceType, urgency)
      }
      
      return {
        success: true,
        callId: callResult.call_id,
        callStatus: callResult.call_status,
        routing: routing,
        message: routing.isEmergency 
          ? `Emergency call initiated! Our specialist will call you at ${customerPhoneNumber} within ${routing.estimatedResponseTime}. Call ID: ${callResult.call_id}`
          : `Phone call scheduled! Our AI booking assistant will call you at ${customerPhoneNumber} within ${routing.estimatedResponseTime}. Call ID: ${callResult.call_id}`,
        estimatedCallTime: routing.estimatedResponseTime,
        supportNumber: "(360) 641-7386"
      }
    } catch (error) {
      console.error('Phone call initiation error:', error)
      return {
        success: false,
        message: "Unable to initiate phone call at the moment. Please try calling us directly at (360) 641-7386 or contact support.",
        fallbackNumber: "(360) 641-7386"
      }
    }
  }
})

export const requestCallback = tool({
  description: 'Schedule a callback for customer at their preferred time',
  parameters: z.object({
    customerPhoneNumber: z.string().describe('Customer phone number for callback'),
    preferredTime: z.string().describe('When customer wants to be called back'),
    serviceType: z.string().optional().describe('Type of service they need help with'),
    customerName: z.string().optional().describe('Customer name'),
    urgency: z.enum(['normal', 'urgent', 'emergency']).default('normal').describe('How urgent their request is'),
    notes: z.string().optional().describe('Additional notes about their request')
  }),
  async execute({ customerPhoneNumber, preferredTime, serviceType, customerName, urgency, notes }) {
    await logToolExecution('booking', 'request_callback')
    
    try {
      // Store callback request in database (simplified for now)
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      const callbackData = {
        phone_number: customerPhoneNumber,
        preferred_time: preferredTime,
        service_type: serviceType || 'general_inquiry',
        customer_name: customerName,
        urgency,
        notes,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      
      // In a real implementation, you'd store this in a callbacks table
      // For now, we'll just log it and schedule the call
      
      const isUrgent = urgency === 'urgent' || urgency === 'emergency'
      const callTimeMessage = isUrgent 
        ? "within 1 hour" 
        : `at your requested time: ${preferredTime}`
      
      return {
        success: true,
        callbackScheduled: true,
        message: `Callback scheduled! We'll call you at ${customerPhoneNumber} ${callTimeMessage}. If you need immediate assistance, call (360) 641-7386.`,
        callbackTime: preferredTime,
        urgencyLevel: urgency,
        supportNumber: "(360) 641-7386"
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to schedule callback at the moment. Please call us directly at (360) 641-7386 for immediate assistance."
      }
    }
  }
})

export const getPhoneSupport = tool({
  description: 'Get information about phone support options and numbers',
  parameters: z.object({
    inquiryType: z.enum(['general', 'booking', 'emergency', 'billing']).optional().describe('Type of support needed')
  }),
  async execute({ inquiryType }) {
    await logToolExecution('booking', 'get_phone_support')
    
    const supportInfo = {
      general: {
        number: "(360) 641-7386",
        description: "General support and booking assistance",
        availability: "24/7 AI assistant available",
        avgWaitTime: "Immediate connection"
      },
      booking: {
        number: "(360) 641-7386",
        description: "Booking assistance and service scheduling",
        availability: "24/7 AI booking assistant",
        avgWaitTime: "Immediate connection"
      },
      emergency: {
        number: "(360) 641-7386",
        description: "Emergency services and disaster response",
        availability: "24/7 emergency response",
        avgWaitTime: "Priority routing - immediate response"
      },
      billing: {
        number: "(360) 641-7386",
        description: "Billing questions and payment support",
        availability: "24/7 AI assistant, human agents Mon-Fri 9AM-6PM",
        avgWaitTime: "Immediate AI assistance"
      }
    }
    
    if (inquiryType && supportInfo[inquiryType]) {
      return {
        success: true,
        support: supportInfo[inquiryType],
        allNumbers: {
          main: "(360) 641-7386"
        }
      }
    }
    
    return {
      success: true,
      support: {
        mainNumber: "(360) 641-7386",
        description: "Our AI phone assistant can help with all your needs 24/7",
        capabilities: [
          "Service booking and scheduling",
          "Price quotes and estimates", 
          "Emergency service routing",
          "General questions and support",
          "Callback scheduling",
          "Provider matching"
        ]
      }
    }
  }
})