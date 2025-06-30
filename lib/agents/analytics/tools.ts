import { tool } from 'ai'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/client'
import { logToolExecution } from '../core/logging'

export const queryBusinessMetrics = tool({
  description: 'Query key business metrics and KPIs for specified time period',
  parameters: z.object({
    metric: z.enum(['revenue', 'bookings', 'customers', 'providers', 'satisfaction', 'growth']).describe('Type of metric to analyze'),
    timeframe: z.enum(['week', 'month', 'quarter', 'year']).describe('Time period for analysis'),
    startDate: z.string().optional().describe('Start date for custom range (YYYY-MM-DD)'),
    endDate: z.string().optional().describe('End date for custom range (YYYY-MM-DD)')
  }),
  async execute({ metric, timeframe, startDate, endDate }) {
    await logToolExecution('analytics', 'query_business_metrics')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      let dateFilter = ''
      
      // Calculate date range based on timeframe
      const now = new Date()
      if (!startDate || !endDate) {
        switch (timeframe) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            endDate = now.toISOString().split('T')[0]
            break
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
            endDate = now.toISOString().split('T')[0]
            break
          case 'quarter':
            const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
            startDate = quarterStart.toISOString().split('T')[0]
            endDate = now.toISOString().split('T')[0]
            break
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
            endDate = now.toISOString().split('T')[0]
            break
        }
      }
      
      let result: any = {}
      
      switch (metric) {
        case 'revenue':
          const { data: revenueData } = await supabase
            .from('bookings')
            .select('final_price, estimated_price, created_at')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .in('status', ['completed', 'paid'])
          
          const totalRevenue = revenueData?.reduce((sum, booking) => 
            sum + (booking.final_price || booking.estimated_price || 0), 0) || 0
          
          result = {
            totalRevenue,
            bookingCount: revenueData?.length || 0,
            averageBookingValue: revenueData?.length ? totalRevenue / revenueData.length : 0,
            timeframe: `${startDate} to ${endDate}`
          }
          break
          
        case 'bookings':
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select('status, created_at, service_id')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
          
          const statusCounts = bookingsData?.reduce((acc: any, booking) => {
            acc[booking.status] = (acc[booking.status] || 0) + 1
            return acc
          }, {}) || {}
          
          result = {
            totalBookings: bookingsData?.length || 0,
            statusBreakdown: statusCounts,
            completionRate: bookingsData?.length ? 
              (statusCounts.completed || 0) / bookingsData.length * 100 : 0,
            timeframe: `${startDate} to ${endDate}`
          }
          break
          
        case 'customers':
          const { data: customersData } = await supabase
            .from('users')
            .select('created_at, customer_type')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
          
          const { data: totalCustomers } = await supabase
            .from('users')
            .select('id', { count: 'exact' })
          
          result = {
            newCustomers: customersData?.length || 0,
            totalCustomers: totalCustomers?.length || 0,
            customerTypes: customersData?.reduce((acc: any, user) => {
              acc[user.customer_type] = (acc[user.customer_type] || 0) + 1
              return acc
            }, {}) || {},
            timeframe: `${startDate} to ${endDate}`
          }
          break
          
        case 'providers':
          const { data: providersData } = await supabase
            .from('providers')
            .select('created_at, active, rating, total_jobs')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
          
          const { data: allProviders } = await supabase
            .from('providers')
            .select('active, rating, total_jobs')
          
          const activeProviders = allProviders?.filter(p => p.active).length || 0
          const avgRating = allProviders && allProviders.length > 0 
            ? allProviders.reduce((sum, p) => sum + (p.rating || 0), 0) / allProviders.length 
            : 0
          
          result = {
            newProviders: providersData?.length || 0,
            totalActiveProviders: activeProviders,
            averageRating: Math.round(avgRating * 100) / 100,
            totalJobs: allProviders?.reduce((sum, p) => sum + (p.total_jobs || 0), 0) || 0,
            timeframe: `${startDate} to ${endDate}`
          }
          break
          
        default:
          return {
            success: false,
            message: "Metric type not supported"
          }
      }
      
      return {
        success: true,
        metric,
        data: result
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to fetch business metrics at the moment"
      }
    }
  }
})

export const getTopPerformingServices = tool({
  description: 'Get the top performing services by bookings, revenue, or satisfaction',
  parameters: z.object({
    sortBy: z.enum(['bookings', 'revenue', 'rating']).describe('Metric to sort services by'),
    limit: z.number().min(1).max(20).default(10).describe('Number of top services to return'),
    timeframe: z.enum(['week', 'month', 'quarter', 'year']).describe('Time period for analysis')
  }),
  async execute({ sortBy, limit, timeframe }) {
    await logToolExecution('analytics', 'get_top_performing_services')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      // Calculate date range
      const now = new Date()
      let startDate: string
      
      switch (timeframe) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
          break
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString()
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1).toISOString()
          break
      }
      
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          service_id,
          estimated_price,
          final_price,
          status,
          services(title, description, category)
        `)
        .gte('created_at', startDate)
      
      if (!bookings) {
        return {
          success: false,
          message: "No booking data available"
        }
      }
      
      // Aggregate data by service
      const serviceStats = bookings.reduce((acc: any, booking) => {
        const serviceId = booking.service_id
        if (!acc[serviceId]) {
          acc[serviceId] = {
            serviceId,
            title: (booking.services as any)?.title || 'Unknown Service',
            category: (booking.services as any)?.category || 'General',
            bookingCount: 0,
            totalRevenue: 0,
            completedBookings: 0,
            averagePrice: 0
          }
        }
        
        acc[serviceId].bookingCount++
        const price = booking.final_price || booking.estimated_price || 0
        acc[serviceId].totalRevenue += price
        
        if (booking.status === 'completed') {
          acc[serviceId].completedBookings++
        }
        
        return acc
      }, {})
      
      // Calculate averages and sort
      const serviceArray = Object.values(serviceStats).map((service: any) => ({
        ...service,
        averagePrice: service.bookingCount > 0 ? service.totalRevenue / service.bookingCount : 0,
        completionRate: service.bookingCount > 0 ? (service.completedBookings / service.bookingCount) * 100 : 0
      }))
      
      // Sort by specified metric
      serviceArray.sort((a: any, b: any) => {
        switch (sortBy) {
          case 'bookings':
            return b.bookingCount - a.bookingCount
          case 'revenue':
            return b.totalRevenue - a.totalRevenue
          case 'rating':
            return b.completionRate - a.completionRate
          default:
            return b.bookingCount - a.bookingCount
        }
      })
      
      return {
        success: true,
        services: serviceArray.slice(0, limit),
        sortBy,
        timeframe,
        totalServices: serviceArray.length
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to fetch service performance data"
      }
    }
  }
})

export const getProviderPerformance = tool({
  description: 'Analyze provider performance metrics and rankings',
  parameters: z.object({
    providerId: z.string().optional().describe('Specific provider ID to analyze'),
    sortBy: z.enum(['rating', 'jobs', 'revenue']).default('rating').describe('Metric to sort providers by'),
    limit: z.number().min(1).max(50).default(20).describe('Number of providers to return')
  }),
  async execute({ providerId, sortBy, limit }) {
    await logToolExecution('analytics', 'get_provider_performance')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      if (providerId) {
        // Get specific provider details
        const { data: provider } = await supabase
          .from('providers')
          .select(`
            id,
            business_name,
            rating,
            total_jobs,
            active,
            services,
            created_at
          `)
          .eq('id', providerId)
          .single()
        
        if (!provider) {
          return {
            success: false,
            message: "Provider not found"
          }
        }
        
        // Get recent bookings for this provider
        const { data: recentBookings } = await supabase
          .from('bookings')
          .select('status, estimated_price, final_price, created_at')
          .eq('provider_id', providerId)
          .order('created_at', { ascending: false })
          .limit(10)
        
        const revenue = recentBookings?.reduce((sum, booking) => 
          sum + (booking.final_price || booking.estimated_price || 0), 0) || 0
        
        return {
          success: true,
          provider: {
            ...provider,
            recentRevenue: revenue,
            recentBookings: recentBookings?.length || 0,
            averageBookingValue: recentBookings?.length ? revenue / recentBookings.length : 0
          }
        }
      } else {
        // Get top providers
        const { data: providers } = await supabase
          .from('providers')
          .select(`
            id,
            business_name,
            rating,
            total_jobs,
            active,
            created_at
          `)
          .eq('active', true)
          .order(sortBy === 'rating' ? 'rating' : 'total_jobs', { ascending: false })
          .limit(limit)
        
        return {
          success: true,
          providers: providers || [],
          sortBy,
          totalProviders: providers?.length || 0
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to fetch provider performance data"
      }
    }
  }
})

export const getAgentAnalytics = tool({
  description: 'Analyze AI agent usage and performance metrics',
  parameters: z.object({
    agentType: z.enum(['recruiting', 'booking', 'support', 'analytics']).optional().describe('Specific agent to analyze'),
    timeframe: z.enum(['day', 'week', 'month']).default('week').describe('Time period for analysis')
  }),
  async execute({ agentType, timeframe }) {
    await logToolExecution('analytics', 'get_agent_analytics')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      // Calculate date range
      const now = new Date()
      let startDate: string
      
      switch (timeframe) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
          break
      }
      
      let query = supabase
        .from('agent_interactions')
        .select('agent_type, success, response_time_ms, tool_used, created_at')
        .gte('created_at', startDate)
      
      if (agentType) {
        query = query.eq('agent_type', agentType)
      }
      
      const { data: interactions } = await query
      
      if (!interactions) {
        return {
          success: false,
          message: "No agent interaction data available"
        }
      }
      
      // Aggregate analytics
      const analytics = interactions.reduce((acc: any, interaction) => {
        const agent = interaction.agent_type
        if (!acc[agent]) {
          acc[agent] = {
            agentType: agent,
            totalInteractions: 0,
            successfulInteractions: 0,
            averageResponseTime: 0,
            toolUsage: {},
            successRate: 0
          }
        }
        
        acc[agent].totalInteractions++
        if (interaction.success) {
          acc[agent].successfulInteractions++
        }
        
        if (interaction.response_time_ms) {
          acc[agent].averageResponseTime += interaction.response_time_ms
        }
        
        if (interaction.tool_used) {
          acc[agent].toolUsage[interaction.tool_used] = 
            (acc[agent].toolUsage[interaction.tool_used] || 0) + 1
        }
        
        return acc
      }, {})
      
      // Calculate final metrics
      Object.values(analytics).forEach((agent: any) => {
        agent.successRate = agent.totalInteractions > 0 ? 
          (agent.successfulInteractions / agent.totalInteractions) * 100 : 0
        agent.averageResponseTime = agent.totalInteractions > 0 ? 
          agent.averageResponseTime / agent.totalInteractions : 0
      })
      
      return {
        success: true,
        analytics: agentType ? analytics[agentType] : Object.values(analytics),
        timeframe,
        totalInteractions: interactions.length
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to fetch agent analytics"
      }
    }
  }
})

export const generateBusinessReport = tool({
  description: 'Generate a comprehensive business performance report',
  parameters: z.object({
    reportType: z.enum(['daily', 'weekly', 'monthly', 'quarterly']).describe('Type of report to generate'),
    includeComparisons: z.boolean().default(true).describe('Include period-over-period comparisons')
  }),
  async execute({ reportType, includeComparisons }) {
    await logToolExecution('analytics', 'generate_business_report')
    
    try {
      const supabase = createServerClient()
      
      if (!supabase) {
        return { error: 'Service temporarily unavailable' }
      }
      
      const now = new Date()
      
      // Calculate current and previous periods
      let currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date
      
      switch (reportType) {
        case 'daily':
          currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          currentEnd = now
          previousStart = new Date(currentStart.getTime() - 24 * 60 * 60 * 1000)
          previousEnd = currentStart
          break
        case 'weekly':
          currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          currentEnd = now
          previousStart = new Date(currentStart.getTime() - 7 * 24 * 60 * 60 * 1000)
          previousEnd = currentStart
          break
        case 'monthly':
          currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
          currentEnd = now
          previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          previousEnd = currentStart
          break
        case 'quarterly':
          const quarter = Math.floor(now.getMonth() / 3)
          currentStart = new Date(now.getFullYear(), quarter * 3, 1)
          currentEnd = now
          previousStart = new Date(now.getFullYear(), (quarter - 1) * 3, 1)
          previousEnd = currentStart
          break
      }
      
      // Get current period data
      const { data: currentBookings } = await supabase
        .from('bookings')
        .select('status, estimated_price, final_price, created_at')
        .gte('created_at', currentStart.toISOString())
        .lte('created_at', currentEnd.toISOString())
      
      const { data: currentUsers } = await supabase
        .from('users')
        .select('id, created_at')
        .gte('created_at', currentStart.toISOString())
        .lte('created_at', currentEnd.toISOString())
      
      // Calculate current metrics
      const currentRevenue = currentBookings?.reduce((sum, booking) => 
        sum + (booking.final_price || booking.estimated_price || 0), 0) || 0
      const currentBookingCount = currentBookings?.length || 0
      const currentNewUsers = currentUsers?.length || 0
      
      let comparison = null
      if (includeComparisons) {
        // Get previous period data
        const { data: previousBookings } = await supabase
          .from('bookings')
          .select('status, estimated_price, final_price, created_at')
          .gte('created_at', previousStart.toISOString())
          .lte('created_at', previousEnd.toISOString())
        
        const { data: previousUsers } = await supabase
          .from('users')
          .select('id, created_at')
          .gte('created_at', previousStart.toISOString())
          .lte('created_at', previousEnd.toISOString())
        
        const previousRevenue = previousBookings?.reduce((sum, booking) => 
          sum + (booking.final_price || booking.estimated_price || 0), 0) || 0
        const previousBookingCount = previousBookings?.length || 0
        const previousNewUsers = previousUsers?.length || 0
        
        comparison = {
          revenueChange: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
          bookingChange: previousBookingCount > 0 ? ((currentBookingCount - previousBookingCount) / previousBookingCount) * 100 : 0,
          userChange: previousNewUsers > 0 ? ((currentNewUsers - previousNewUsers) / previousNewUsers) * 100 : 0
        }
      }
      
      const report = {
        reportType,
        period: `${currentStart.toISOString().split('T')[0]} to ${currentEnd.toISOString().split('T')[0]}`,
        metrics: {
          revenue: currentRevenue,
          bookings: currentBookingCount,
          newUsers: currentNewUsers,
          averageBookingValue: currentBookingCount > 0 ? currentRevenue / currentBookingCount : 0
        },
        comparison,
        generatedAt: new Date().toISOString()
      }
      
      return {
        success: true,
        report
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to generate business report"
      }
    }
  }
})