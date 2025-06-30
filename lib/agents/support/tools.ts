import { tool } from 'ai'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/client'
import { logToolExecution } from '../core/logging'

export const getBookingStatus = tool({
  description: 'Get the status and details of a customer booking',
  parameters: z.object({
    bookingId: z.string().describe('The booking ID to check status for'),
    customerEmail: z.string().optional().describe('Customer email for verification')
  }),
  async execute({ bookingId, customerEmail }) {
    await logToolExecution('support', 'get_booking_status')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      let query = supabase
        .from('bookings')
        .select(`
          id,
          status,
          scheduled_date,
          scheduled_time,
          address,
          estimated_price,
          special_instructions,
          created_at,
          services(title, description),
          providers(business_name, rating)
        `)
        .eq('id', bookingId)
      
      // If email provided, verify it matches
      if (customerEmail) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', customerEmail)
          .single()
        
        if (user) {
          query = query.eq('user_id', user.id)
        } else {
          return {
            success: false,
            message: "No booking found with that email address"
          }
        }
      }
      
      const { data: booking, error } = await query.single()
      
      if (error || !booking) {
        return {
          success: false,
          message: "Booking not found"
        }
      }
      
      // Get tracking information
      const { data: tracking } = await supabase
        .from('tracking')
        .select('status, created_at, notes')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false })
        .limit(5)
      
      return {
        success: true,
        booking: {
          id: booking.id,
          status: booking.status,
          scheduledDate: booking.scheduled_date,
          scheduledTime: booking.scheduled_time,
          address: booking.address,
          estimatedPrice: booking.estimated_price,
          serviceTitle: (booking.services as any)?.title,
          providerName: (booking.providers as any)?.business_name,
          providerRating: (booking.providers as any)?.rating,
          recentUpdates: tracking?.slice(0, 3) || []
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to retrieve booking status at the moment"
      }
    }
  }
})

export const searchFAQ = tool({
  description: 'Search frequently asked questions and knowledge base',
  parameters: z.object({
    query: z.string().describe('The question or topic to search for')
  }),
  async execute({ query }) {
    await logToolExecution('support', 'search_faq')
    
    const faqDatabase = {
      booking: {
        "How do I book a service?": "You can book through our website, mobile app, or by calling our support team. Simply select your service, choose a time, and confirm your booking.",
        "Can I reschedule my appointment?": "Yes, you can reschedule up to 4 hours before your appointment through your dashboard or by contacting support.",
        "How do I cancel my booking?": "Free cancellation is available up to 4 hours before your scheduled time. You can cancel through your account dashboard."
      },
      payment: {
        "When am I charged?": "Payment is processed after your service is completed. You'll receive an invoice via email.",
        "What payment methods do you accept?": "We accept all major credit cards, debit cards, and digital payment methods like Apple Pay and Google Pay.",
        "Can I get a refund?": "Refunds are processed based on our satisfaction guarantee. If you're not happy with the service, contact us within 24 hours."
      },
      providers: {
        "Are your providers licensed?": "Yes, all our providers are licensed, insured, and have passed background checks.",
        "How do you choose providers?": "Providers are selected based on experience, customer ratings, availability, and proximity to your location.",
        "Can I request a specific provider?": "Yes, you can request a specific provider if they're available for your service and time slot."
      },
      emergency: {
        "Do you offer emergency services?": "Yes, we provide 24/7 emergency services for plumbing, electrical, and disaster cleanup with higher priority and pricing.",
        "How quickly can you respond to emergencies?": "Emergency services typically respond within 1-2 hours, depending on your location and the nature of the emergency."
      },
      account: {
        "How do I create an account?": "You can sign up on our website or app with your email address or through Google/Apple sign-in.",
        "I forgot my password": "Use the 'Forgot Password' link on the login page to reset your password via email.",
        "How do I update my account information?": "You can update your profile, address, and payment information in your account dashboard."
      }
    }
    
    const queryLower = query.toLowerCase()
    const results: Array<{ category: string; question: string; answer: string }> = []
    
    Object.entries(faqDatabase).forEach(([category, faqs]) => {
      Object.entries(faqs).forEach(([question, answer]) => {
        if (
          question.toLowerCase().includes(queryLower) ||
          answer.toLowerCase().includes(queryLower) ||
          category.includes(queryLower)
        ) {
          results.push({ category, question, answer })
        }
      })
    })
    
    return {
      success: true,
      results: results.slice(0, 5), // Limit to top 5 results
      totalFound: results.length
    }
  }
})

export const createSupportTicket = tool({
  description: 'Create a support ticket for issues that need human assistance',
  parameters: z.object({
    customerEmail: z.string().describe('Customer email address'),
    subject: z.string().describe('Brief description of the issue'),
    description: z.string().describe('Detailed description of the problem'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).describe('Priority level of the issue'),
    category: z.string().optional().describe('Category of the issue (booking, payment, provider, etc.)')
  }),
  async execute({ customerEmail, subject, description, priority, category }) {
    await logToolExecution('support', 'create_support_ticket')
    
    try {
      // In a real implementation, you'd save this to a support ticket system
      const ticketId = `TK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      return {
        success: true,
        ticket: {
          id: ticketId,
          subject,
          description,
          priority,
          category: category || 'general',
          status: 'open',
          estimatedResponse: priority === 'urgent' ? '1 hour' : priority === 'high' ? '4 hours' : '24 hours',
          message: `Support ticket ${ticketId} has been created. Our team will respond within the estimated timeframe.`
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to create support ticket at the moment"
      }
    }
  }
})

export const getServiceAreaInfo = tool({
  description: 'Check if services are available in a specific area',
  parameters: z.object({
    zipCode: z.string().describe('Zip code to check service availability'),
    serviceType: z.string().optional().describe('Specific service type to check')
  }),
  async execute({ zipCode, serviceType }) {
    await logToolExecution('support', 'get_service_area_info')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      // Simplified service area check - in reality, you'd have a service areas table
      const serviceAreas = [
        '10001', '10002', '10003', '10004', '10005', // NYC areas
        '90210', '90211', '90212', // LA areas
        '60601', '60602', '60603', // Chicago areas
        // Add more as needed
      ]
      
      const isServiceable = serviceAreas.includes(zipCode)
      
      if (!isServiceable) {
        return {
          success: false,
          message: `We don't currently service the ${zipCode} area, but we're expanding! You can join our waitlist to be notified when we arrive.`
        }
      }
      
      // Get available providers in the area (simplified)
      const { data: providers } = await supabase
        .from('providers')
        .select('id, business_name, services, rating')
        .eq('active', true)
      
      let availableProviders = providers || []
      
      if (serviceType) {
        availableProviders = providers?.filter(p => 
          p.services?.includes(serviceType)
        ) || []
      }
      
      return {
        success: true,
        serviceArea: {
          zipCode,
          isServiceable: true,
          providersAvailable: availableProviders.length,
          estimatedResponseTime: '2-4 hours',
          emergencyAvailable: true,
          message: `Great news! We service the ${zipCode} area with ${availableProviders.length} available providers.`
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to check service area at the moment"
      }
    }
  }
})

export const getAccountInfo = tool({
  description: 'Get account information and recent activity for a customer',
  parameters: z.object({
    customerEmail: z.string().describe('Customer email address for account lookup')
  }),
  async execute({ customerEmail }) {
    await logToolExecution('support', 'get_account_info')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      // Get user information
      const { data: user } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, phone, created_at')
        .eq('email', customerEmail)
        .single()
      
      if (!user) {
        return {
          success: false,
          message: "No account found with that email address"
        }
      }
      
      // Get recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          scheduled_date,
          estimated_price,
          services(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      // Get subscription info if any
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type, status, monthly_price')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
      
      return {
        success: true,
        account: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          memberSince: user.created_at,
          recentBookings: recentBookings?.map(b => ({
            id: b.id,
            service: (b.services as any)?.title,
            status: b.status,
            date: b.scheduled_date,
            amount: b.estimated_price
          })) || [],
          subscription: subscription ? {
            plan: subscription.plan_type,
            status: subscription.status,
            monthlyPrice: subscription.monthly_price
          } : null
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to retrieve account information at the moment"
      }
    }
  }
})