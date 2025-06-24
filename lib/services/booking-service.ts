import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'

export interface BookingSubmission {
  service_id: string
  customer_id: string
  booking_date: string
  booking_time: string
  address: string
  special_instructions?: string
  home_size: string
  urgency: string
  total_amount: number
  status: BookingStatus
}

export interface QuoteRequestSubmission {
  service_id: string
  customer_id: string
  preferred_date?: string
  preferred_time?: string
  address: string
  project_details: string
  estimated_budget?: string
  urgency: string
  photos?: string[]
  status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'declined'
}

/**
 * Submit a new booking to the database
 */
export async function submitBooking(bookingData: BookingSubmission) {
  
  
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error submitting booking:', error)
    return { data: null, error }
  }
}

/**
 * Submit a new quote request to the database
 */
export async function submitQuoteRequest(quoteData: QuoteRequestSubmission) {
  
  
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .insert(quoteData)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error submitting quote request:', error)
    return { data: null, error }
  }
}

/**
 * Get all bookings for a customer
 */
export async function getCustomerBookings(customerId: string) {
  
  
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:service_id (*)
      `)
      .eq('customer_id', customerId)
      .order('booking_date', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching customer bookings:', error)
    return { data: null, error }
  }
}

/**
 * Get all quote requests for a customer
 */
export async function getCustomerQuoteRequests(customerId: string) {
  
  
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        service:service_id (*)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching customer quote requests:', error)
    return { data: null, error }
  }
}

/**
 * Get a specific booking by ID
 */
/**
 * Get all active services
 */
export async function getServices() {
  
  
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('title')
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching services:', error)
    return { data: null, error }
  }
}

/**
 * Get a specific booking by ID
 */
/**
 * Get active subscription for a customer
 */
export async function getCustomerSubscription(customerId: string) {
  
  
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_id', customerId)
      .eq('status', 'active')
      .maybeSingle()
    
    if (error && error.code !== 'PGRST116') throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching customer subscription:', error)
    return { data: null, error }
  }
}

/**
 * Get a specific booking by ID
 */
export async function getBookingById(bookingId: string) {
  
  
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:service_id (*),
        customer:customer_id (*)
      `)
      .eq('id', bookingId)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching booking:', error)
    return { data: null, error }
  }
}
