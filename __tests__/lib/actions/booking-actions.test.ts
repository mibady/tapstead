import { updateBookingStatus, cancelBooking } from '@/lib/actions/booking-actions'

// Mock the Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
}

jest.mock('@/lib/supabase/client', () => ({
  createServerClient: jest.fn(() => mockSupabaseClient),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => new Map()),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

describe('Booking Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('updateBookingStatus', () => {
    it('should allow booking owner to update status', async () => {
      const bookingId = 'booking-123'
      const userId = 'user-123'
      
      // Mock authenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: userId } },
        error: null,
      })

      // Mock booking query - user owns the booking
      const mockBookingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: bookingId,
            user_id: userId,
            provider_id: 'provider-123',
            providers: { user_id: 'provider-user-123' },
          },
          error: null,
        }),
      }

      // Mock user profile query
      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { customer_type: 'customer' },
          error: null,
        }),
      }

      // Mock booking update
      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      // Mock tracking insert
      const mockTrackingQuery = {
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockBookingQuery) // bookings select
        .mockReturnValueOnce(mockProfileQuery) // profiles select
        .mockReturnValueOnce(mockUpdateQuery) // bookings update
        .mockReturnValueOnce(mockTrackingQuery) // tracking insert

      const result = await updateBookingStatus(bookingId, 'confirmed')

      expect(result.success).toBe(true)
      expect(mockUpdateQuery.update).toHaveBeenCalledWith({
        status: 'confirmed',
        updated_at: expect.any(String),
      })
      expect(mockTrackingQuery.insert).toHaveBeenCalled()
    })

    it('should reject unauthorized user', async () => {
      const bookingId = 'booking-123'
      const userId = 'user-123'
      const otherUserId = 'other-user-456'
      
      // Mock authenticated user (different from booking owner)
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: otherUserId } },
        error: null,
      })

      // Mock booking query - user does NOT own the booking
      const mockBookingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: bookingId,
            user_id: userId, // Different user owns this booking
            provider_id: 'provider-123',
            providers: { user_id: 'provider-user-123' },
          },
          error: null,
        }),
      }

      // Mock user profile query
      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { customer_type: 'customer' }, // Not admin
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockBookingQuery)
        .mockReturnValueOnce(mockProfileQuery)

      await expect(updateBookingStatus(bookingId, 'confirmed')).rejects.toThrow(
        'Unauthorized: You don\'t have permission to update this booking'
      )
    })

    it('should allow admin to update any booking', async () => {
      const bookingId = 'booking-123'
      const adminUserId = 'admin-123'
      const bookingOwnerId = 'owner-456'
      
      // Mock authenticated admin user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: adminUserId } },
        error: null,
      })

      // Mock booking query
      const mockBookingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: bookingId,
            user_id: bookingOwnerId, // Different user owns this booking
            provider_id: 'provider-123',
            providers: { user_id: 'provider-user-123' },
          },
          error: null,
        }),
      }

      // Mock admin profile query
      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { customer_type: 'admin' }, // Admin user
          error: null,
        }),
      }

      // Mock successful update
      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      const mockTrackingQuery = {
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockBookingQuery)
        .mockReturnValueOnce(mockProfileQuery)
        .mockReturnValueOnce(mockUpdateQuery)
        .mockReturnValueOnce(mockTrackingQuery)

      const result = await updateBookingStatus(bookingId, 'confirmed')

      expect(result.success).toBe(true)
    })
  })

  describe('cancelBooking', () => {
    it('should allow booking owner to cancel their booking', async () => {
      const bookingId = 'booking-123'
      const userId = 'user-123'
      
      // Mock authenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: userId } },
        error: null,
      })

      // Mock booking query - user owns booking and it's not completed
      const mockBookingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: bookingId,
            user_id: userId,
            status: 'confirmed',
          },
          error: null,
        }),
      }

      // Mock successful cancellation
      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      const mockTrackingQuery = {
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockBookingQuery)
        .mockReturnValueOnce(mockUpdateQuery)
        .mockReturnValueOnce(mockTrackingQuery)

      const result = await cancelBooking(bookingId)

      expect(result.success).toBe(true)
      expect(mockUpdateQuery.update).toHaveBeenCalledWith({
        status: 'cancelled',
        updated_at: expect.any(String),
      })
    })

    it('should reject cancellation of completed booking', async () => {
      const bookingId = 'booking-123'
      const userId = 'user-123'
      
      // Mock authenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: userId } },
        error: null,
      })

      // Mock booking query - booking is already completed
      const mockBookingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: bookingId,
            user_id: userId,
            status: 'completed', // Cannot cancel completed booking
          },
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValueOnce(mockBookingQuery)

      await expect(cancelBooking(bookingId)).rejects.toThrow(
        'Cannot cancel a booking that is already completed or cancelled'
      )
    })

    it('should reject unauthorized user cancellation', async () => {
      const bookingId = 'booking-123'
      const userId = 'user-123'
      const otherUserId = 'other-user-456'
      
      // Mock authenticated user (different from booking owner)
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: otherUserId } },
        error: null,
      })

      // Mock booking query - user does NOT own the booking
      const mockBookingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: bookingId,
            user_id: userId, // Different user owns this booking
            status: 'confirmed',
          },
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValueOnce(mockBookingQuery)

      await expect(cancelBooking(bookingId)).rejects.toThrow(
        'Unauthorized: You can only cancel your own bookings'
      )
    })
  })
})