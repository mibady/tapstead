import { stripe } from '@/lib/stripe/config'
import { createServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// This webhook endpoint secret should be set in your environment
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    await handleStripeEvent(event)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handling failed' },
      { status: 500 }
    )
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  const supabase = createServerClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentSuccess(paymentIntent, supabase)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentFailed(paymentIntent, supabase)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      await handleSubscriptionPaymentSuccess(invoice, supabase)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await handleSubscriptionPaymentFailed(invoice, supabase)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionUpdated(subscription, supabase)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionCanceled(subscription, supabase)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  try {
    const bookingId = paymentIntent.metadata.booking_id
    const userId = paymentIntent.metadata.user_id

    if (!bookingId || !userId) {
      console.error('Missing booking_id or user_id in payment intent metadata')
      return
    }

    // Update booking status
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        stripe_payment_intent_id: paymentIntent.id,
        final_price: paymentIntent.amount / 100,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating booking after payment:', error)
      return
    }

    // Add tracking entry
    await supabase.from('tracking').insert({
      booking_id: bookingId,
      status: 'payment_confirmed',
      notes: `Payment of $${paymentIntent.amount / 100} confirmed via webhook`,
      created_at: new Date().toISOString(),
    })

    console.log(`Payment confirmed for booking ${bookingId}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  try {
    const bookingId = paymentIntent.metadata.booking_id
    const userId = paymentIntent.metadata.user_id

    if (!bookingId || !userId) {
      console.error('Missing booking_id or user_id in payment intent metadata')
      return
    }

    // Update booking status
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating booking after payment failure:', error)
      return
    }

    // Add tracking entry
    await supabase.from('tracking').insert({
      booking_id: bookingId,
      status: 'payment_failed',
      notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
      created_at: new Date().toISOString(),
    })

    console.log(`Payment failed for booking ${bookingId}`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handleSubscriptionPaymentSuccess(invoice: Stripe.Invoice, supabase: any) {
  try {
    const subscriptionId = (invoice as any).subscription 
      ? typeof (invoice as any).subscription === 'string' 
        ? (invoice as any).subscription 
        : (invoice as any).subscription?.id
      : null
    
    if (!subscriptionId) {
      console.error('Missing subscription ID in invoice')
      return
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any
    const userId = subscription.metadata?.user_id

    if (!userId) {
      console.error('Missing user_id in subscription metadata')
      return
    }

    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating subscription after payment:', error)
      return
    }

    console.log(`Subscription payment confirmed for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription payment success:', error)
  }
}

async function handleSubscriptionPaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  try {
    const subscriptionId = (invoice as any).subscription 
      ? typeof (invoice as any).subscription === 'string' 
        ? (invoice as any).subscription 
        : (invoice as any).subscription?.id
      : null
    
    if (!subscriptionId) {
      console.error('Missing subscription ID in invoice')
      return
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any
    const userId = subscription.metadata?.user_id

    if (!userId) {
      console.error('Missing user_id in subscription metadata')
      return
    }

    // Update subscription status to past_due
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating subscription after payment failure:', error)
      return
    }

    console.log(`Subscription payment failed for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription payment failure:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  try {
    const subscriptionData = subscription as any
    const userId = subscriptionData.metadata?.user_id

    if (!userId) {
      console.error('Missing user_id in subscription metadata')
      return
    }

    // Update subscription details
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: subscriptionData.status,
        current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionData.id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating subscription:', error)
      return
    }

    console.log(`Subscription updated for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription, supabase: any) {
  try {
    const subscriptionData = subscription as any
    const userId = subscriptionData.metadata?.user_id

    if (!userId) {
      console.error('Missing user_id in subscription metadata')
      return
    }

    // Update subscription status to canceled
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionData.id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error canceling subscription:', error)
      return
    }

    console.log(`Subscription canceled for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}