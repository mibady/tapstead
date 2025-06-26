import { createPaymentIntent, confirmPayment } from '@/lib/actions/payment-actions'

// Mock Stripe
jest.mock('@/lib/stripe/config', () => ({
  stripe: {
    customers: {
      create: jest.fn(),
    },
    paymentIntents: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
    subscriptions: {
      create: jest.fn(),
    },
    products: {
      create: jest.fn(),
    },
    prices: {
      create: jest.fn(),
    },
  },
  SUBSCRIPTION_PLANS: {
    'home-care-plus': {
      name: 'Home Care Plus',
      price: 4900,
      interval: 'month',
      description: '15% discount',
      features: ['15% discount'],
    },
  },
}))

// Mock Supabase server client
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

const { stripe } = require('@/lib/stripe/config')

describe('Payment Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createPaymentIntent', () => {
    it('should create payment intent for authenticated user', async () => {
      const userId = 'user-123'
      const bookingId = 'booking-456'

      // Mock authenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: userId, email: 'test@example.com' } },
        error: null,
      })

      // Mock booking query
      const mockBookingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: bookingId,
            user_id: userId,
            estimated_price: 100,
            status: 'pending',
          },
          error: null,
        }),
      }

      // Mock profile query
      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { stripe_customer_id: 'cus_123' },
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockBookingQuery) // bookings
        .mockReturnValueOnce(mockProfileQuery) // profiles

      // Mock Stripe payment intent creation
      stripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'pi_123_secret_abc',
        amount: 10000,
        currency: 'usd',
      })

      const result = await createPaymentIntent({
        amount: 10000,
        currency: 'usd',
        bookingId,
        description: 'Test payment',
      })

      expect(result.success).toBe(true)
      expect(result.clientSecret).toBe('pi_123_secret_abc')
      expect(result.paymentIntentId).toBe('pi_123')
      expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 10000,
        currency: 'usd',
        customer: 'cus_123',
        description: 'Test payment',
        metadata: {
          booking_id: bookingId,
          user_id: userId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })
    })

    it('should create new Stripe customer if none exists', async () => {
      const userId = 'user-123'
      const bookingId = 'booking-456'

      // Mock authenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: userId, email: 'test@example.com' } },
        error: null,
      })

      // Mock booking query
      const mockBookingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: bookingId,
            user_id: userId,
            estimated_price: 100,
            status: 'pending',
          },
          error: null,
        }),
      }

      // Mock profile query (no existing customer)
      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { stripe_customer_id: null },
          error: null,
        }),
      }

      // Mock profile update
      const mockProfileUpdate = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockBookingQuery) // bookings
        .mockReturnValueOnce(mockProfileQuery) // profiles select
        .mockReturnValueOnce(mockProfileUpdate) // profiles update

      // Mock Stripe customer creation
      stripe.customers.create.mockResolvedValue({
        id: 'cus_new123',
      })

      // Mock Stripe payment intent creation
      stripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'pi_123_secret_abc',
        amount: 10000,
        currency: 'usd',
      })

      const result = await createPaymentIntent({
        amount: 10000,
        currency: 'usd',
        bookingId,
      })

      expect(result.success).toBe(true)
      expect(stripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        metadata: {
          supabase_user_id: userId,
        },
      })
      expect(mockProfileUpdate.update).toHaveBeenCalledWith({
        stripe_customer_id: 'cus_new123',
      })
    })

    it('should reject unauthorized user', async () => {
      // Mock unauthenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await createPaymentIntent({
        amount: 10000,
        currency: 'usd',
        bookingId: 'booking-123',
      })

      expect(result.success).toBe(false)
      expect(result.message).toContain('Failed to create payment intent')
    })

    it('should validate input data', async () => {
      const result = await createPaymentIntent({
        amount: -100, // Invalid negative amount
        currency: 'usd',
        bookingId: 'booking-123',
      })

      expect(result.success).toBe(false)
      expect(result.message).toContain('Amount must be positive')
    })
  })

  describe('confirmPayment', () => {
    it('should confirm successful payment', async () => {
      const userId = 'user-123'
      const bookingId = 'booking-456'
      const paymentIntentId = 'pi_123'

      // Mock authenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: userId } },
        error: null,
      })

      // Mock Stripe payment intent retrieval
      stripe.paymentIntents.retrieve.mockResolvedValue({
        id: paymentIntentId,
        status: 'succeeded',
        amount: 10000,
        metadata: {
          booking_id: bookingId,
          user_id: userId,
        },
      })

      // Mock booking update
      const mockBookingUpdate = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      // Mock tracking insert
      const mockTrackingInsert = {
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockBookingUpdate) // bookings update
        .mockReturnValueOnce(mockTrackingInsert) // tracking insert

      const result = await confirmPayment(paymentIntentId)

      expect(result.success).toBe(true)
      expect(result.bookingId).toBe(bookingId)
      expect(mockBookingUpdate.update).toHaveBeenCalledWith({
        status: 'confirmed',
        payment_status: 'paid',
        stripe_payment_intent_id: paymentIntentId,
        final_price: 100, // $100.00 from 10000 cents
        updated_at: expect.any(String),
      })
    })

    it('should reject failed payment', async () => {
      const userId = 'user-123'
      const paymentIntentId = 'pi_failed'

      // Mock authenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: userId } },
        error: null,
      })

      // Mock failed payment intent
      stripe.paymentIntents.retrieve.mockResolvedValue({
        id: paymentIntentId,
        status: 'requires_payment_method', // Failed status
        metadata: {
          booking_id: 'booking-123',
          user_id: userId,
        },
      })

      const result = await confirmPayment(paymentIntentId)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Payment not successful')
    })

    it('should reject unauthorized payment confirmation', async () => {
      const userId = 'user-123'
      const otherUserId = 'other-user-456'
      const paymentIntentId = 'pi_123'

      // Mock authenticated user
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: otherUserId } },
        error: null,
      })

      // Mock payment intent with different user
      stripe.paymentIntents.retrieve.mockResolvedValue({
        id: paymentIntentId,
        status: 'succeeded',
        metadata: {
          booking_id: 'booking-123',
          user_id: userId, // Different user owns this payment
        },
      })

      const result = await confirmPayment(paymentIntentId)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Unauthorized payment confirmation')
    })
  })
})