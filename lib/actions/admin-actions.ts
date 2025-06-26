'use server'

import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Verify admin role server-side
async function verifyAdminAccess() {
  const cookieStore = cookies()
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Check if user has admin role in profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('customer_type')
    .eq('id', user.id)
    .single()

  if (!profile || profile.customer_type !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  return { user, supabase }
}

export async function getAdminStats() {
  try {
    const { supabase } = await verifyAdminAccess()

    // Fetch booking stats with authorization
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('estimated_price, final_price, created_at')

    if (bookingsError) {
      throw bookingsError
    }

    // Fetch provider stats with authorization
    const { data: providers, error: providersError } = await supabase
      .from('providers')
      .select('id, active')
      .eq('active', true)

    if (providersError) {
      throw providersError
    }

    // Calculate revenue safely
    const totalRevenue = bookings?.reduce((sum: number, booking: any) => {
      const price = booking.final_price || booking.estimated_price || 0
      return sum + price
    }, 0) || 0

    return {
      success: true,
      data: {
        totalBookings: bookings?.length || 0,
        activeProviders: providers?.length || 0,
        revenue: totalRevenue,
        customerSatisfaction: 4.8, // TODO: Calculate from actual reviews
      }
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch admin stats',
      data: {
        totalBookings: 0,
        activeProviders: 0,
        revenue: 0,
        customerSatisfaction: 0,
      }
    }
  }
}

export async function getRecentBookings() {
  try {
    const { supabase } = await verifyAdminAccess()

    const { data: recentBookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        scheduled_date,
        estimated_price,
        final_price,
        created_at,
        services (title),
        users (first_name, last_name),
        providers (business_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      throw error
    }

    return {
      success: true,
      data: recentBookings || []
    }
  } catch (error) {
    console.error('Error fetching recent bookings:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch recent bookings',
      data: []
    }
  }
}

export async function getAllProviders() {
  try {
    const { supabase } = await verifyAdminAccess()

    const { data: providers, error } = await supabase
      .from('providers')
      .select(`
        id,
        business_name,
        rating,
        total_jobs,
        active,
        created_at,
        users (first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      data: providers || []
    }
  } catch (error) {
    console.error('Error fetching providers:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch providers',
      data: []
    }
  }
}

export async function getAllBookings() {
  try {
    const { supabase } = await verifyAdminAccess()

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        scheduled_date,
        estimated_price,
        final_price,
        created_at,
        services (title, category),
        users (first_name, last_name, email),
        providers (business_name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      data: bookings || []
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch bookings',
      data: []
    }
  }
}