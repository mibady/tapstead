'use server'

import { stripe, SUBSCRIPTION_PLANS, SubscriptionPlanId } from '@/lib/stripe/config'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Input validation schemas
const PaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('usd'),
  bookingId: z.string().min(1, 'Booking ID is required'),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
})

const SubscriptionSchema = z.object({
  planId: z.enum(['home-care-plus', 'premium-care']),
  customerId: z.string().optional(),
})

// Verify user authentication
async function verifyAuth() {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  return { user, supabase }
}

/**
 * Create a Payment Intent for one-time payments (bookings)
 */
export async function createPaymentIntent(input: z.infer<typeof PaymentIntentSchema>) {
  try {
    const { user, supabase } = await verifyAuth()
    const validatedInput = PaymentIntentSchema.parse(input)

    // Verify booking ownership
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, user_id, estimated_price, final_price, status')
      .eq('id', validatedInput.bookingId)
      .eq('user_id', user.id)
      .single()

    if (!booking) {
      throw new Error('Booking not found or access denied')
    }

    // Ensure booking can be paid for
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new Error('Cannot pay for completed or cancelled booking')
    }

    // Create or retrieve Stripe customer
    let customerId: string | undefined

    // Check if user has existing Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })

      customerId = customer.id

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: validatedInput.amount,
      currency: validatedInput.currency,
      customer: customerId,
      description: validatedInput.description || `Payment for Tapstead booking ${booking.id}`,
      metadata: {
        booking_id: booking.id,
        user_id: user.id,
        ...validatedInput.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid payment data: ' + error.errors.map(e => e.message).join(', ')
      }
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create payment intent'
    }
  }
}

/**
 * Create a subscription for recurring payments
 */
export async function createSubscription(input: z.infer<typeof SubscriptionSchema>) {
  try {
    const { user, supabase } = await verifyAuth()
    const validatedInput = SubscriptionSchema.parse(input)

    const plan = SUBSCRIPTION_PLANS[validatedInput.planId]
    if (!plan) {
      throw new Error('Invalid subscription plan')
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (existingSubscription) {
      throw new Error('User already has an active subscription')
    }

    // Create or retrieve Stripe customer
    let customerId = validatedInput.customerId

    if (!customerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id,
          },
        })

        customerId = customer.id

        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)
      }
    }

    // Create or retrieve Stripe product and price
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: {
        plan_id: validatedInput.planId,
      },
    })

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.price,
      currency: 'usd',
      recurring: {
        interval: plan.interval,
      },
    })

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId!,
      items: [{ price: price.id }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        user_id: user.id,
        plan_id: validatedInput.planId,
      },
    })

    // Save subscription to database
    await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        stripe_subscription_id: subscription.id,
        plan_type: validatedInput.planId,
        status: 'pending',
        monthly_price: plan.price / 100, // Convert to dollars
        current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        services_included: plan.features,
        discount_percentage: validatedInput.planId === 'home-care-plus' ? 15 : 25,
      })

    const invoice = subscription.latest_invoice as any
    const paymentIntent = invoice?.payment_intent

    return {
      success: true,
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      paymentIntentId: paymentIntent?.id,
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid subscription data: ' + error.errors.map(e => e.message).join(', ')
      }
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create subscription'
    }
  }
}

/**
 * Confirm payment and update booking status
 */
export async function confirmPayment(paymentIntentId: string) {
  try {
    const { user, supabase } = await verifyAuth()

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful')
    }

    const bookingId = paymentIntent.metadata.booking_id
    const userId = paymentIntent.metadata.user_id

    // Verify user owns the booking
    if (userId !== user.id) {
      throw new Error('Unauthorized payment confirmation')
    }

    // Update booking status and payment information
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        stripe_payment_intent_id: paymentIntentId,
        final_price: paymentIntent.amount / 100, // Convert from cents
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('user_id', user.id)

    if (error) throw error

    // Add tracking entry
    await supabase.from('tracking').insert({
      booking_id: bookingId,
      status: 'payment_confirmed',
      notes: 'Payment confirmed successfully',
      created_at: new Date().toISOString(),
    })

    return {
      success: true,
      message: 'Payment confirmed successfully',
      bookingId,
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to confirm payment'
    }
  }
}

/**
 * Cancel or refund a payment
 */
export async function refundPayment(paymentIntentId: string, reason?: string) {
  try {
    const { user, supabase } = await verifyAuth()

    // Get user profile to check admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('customer_type')
      .eq('id', user.id)
      .single()

    // Only admins can process refunds
    if (profile?.customer_type !== 'admin') {
      throw new Error('Unauthorized: Admin access required for refunds')
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
      metadata: {
        refund_reason: reason || 'Customer request',
        processed_by: user.id,
      },
    })

    // Update booking status
    const booking = await stripe.paymentIntents.retrieve(paymentIntentId)
    const bookingId = booking.metadata.booking_id

    await supabase
      .from('bookings')
      .update({
        status: 'refunded',
        payment_status: 'refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    return {
      success: true,
      refundId: refund.id,
      message: 'Refund processed successfully',
    }
  } catch (error) {
    console.error('Error processing refund:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process refund'
    }
  }
}