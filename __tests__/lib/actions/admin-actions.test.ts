import { getAdminStats, getRecentBookings } from '@/lib/actions/admin-actions'

// Mock the Supabase server client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
}

jest.mock('@/lib/supabase/server', () => ({
  createServerClient: jest.fn(() => mockSupabaseClient),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => new Map()),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('Admin Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAdminStats', () => {
    it('should return admin stats for authorized admin user', async () => {
      // Mock authenticated admin user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'admin-user-id' } },
        error: null,
      })

      // Mock profile query for admin check
      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { customer_type: 'admin' },
          error: null,
        }),
      }

      // Mock bookings query
      const mockBookingsQuery = {
        select: jest.fn().mockResolvedValue({
          data: [
            { estimated_price: 100, final_price: 120 },
            { estimated_price: 200, final_price: null },
          ],
          error: null,
        }),
      }

      // Mock providers query
      const mockProvidersQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [{ id: '1' }, { id: '2' }, { id: '3' }],
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockProfileQuery) // profiles table
        .mockReturnValueOnce(mockBookingsQuery) // bookings table
        .mockReturnValueOnce(mockProvidersQuery) // providers table

      const result = await getAdminStats()

      expect(result.success).toBe(true)
      expect(result.data.totalBookings).toBe(2)
      expect(result.data.activeProviders).toBe(3)
      expect(result.data.revenue).toBe(320) // 120 + 200
      expect(result.data.customerSatisfaction).toBe(4.8)
    })

    it('should reject unauthorized user', async () => {
      // Mock non-admin user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'regular-user-id' } },
        error: null,
      })

      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { customer_type: 'customer' },
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockProfileQuery)

      const result = await getAdminStats()

      expect(result.success).toBe(false)
      expect(result.message).toContain('Unauthorized')
    })

    it('should handle database errors gracefully', async () => {
      // Mock authenticated admin user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'admin-user-id' } },
        error: null,
      })

      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { customer_type: 'admin' },
          error: null,
        }),
      }

      // Mock database error
      const mockBookingsQuery = {
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockProfileQuery)
        .mockReturnValueOnce(mockBookingsQuery)

      const result = await getAdminStats()

      expect(result.success).toBe(false)
      expect(result.message).toContain('Failed to fetch admin stats')
    })
  })

  describe('getRecentBookings', () => {
    it('should return recent bookings for authorized admin', async () => {
      // Mock authenticated admin user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'admin-user-id' } },
        error: null,
      })

      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { customer_type: 'admin' },
          error: null,
        }),
      }

      const mockBookingsQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [
            {
              id: 'booking-1',
              status: 'confirmed',
              estimated_price: 100,
              services: { title: 'House Cleaning' },
              users: { first_name: 'John', last_name: 'Doe' },
              providers: { business_name: 'Clean Pro' },
            },
          ],
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockProfileQuery)
        .mockReturnValueOnce(mockBookingsQuery)

      const result = await getRecentBookings()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('booking-1')
    })

    it('should reject unauthorized user', async () => {
      // Mock unauthenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await getRecentBookings()

      expect(result.success).toBe(false)
      expect(result.message).toContain('Failed to fetch recent bookings')
    })
  })
})