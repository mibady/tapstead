import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    console.log('[Checkout] Request data:', requestData)
    
    const { lineItems, metadata } = requestData
    
    if (!lineItems?.length) {
      return NextResponse.json({ error: 'Missing line items' }, { status: 400 })
    }

    if (!metadata) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    console.log('[Checkout] Creating session:', {
      lineItems,
      metadata
    })

    console.log('[Checkout] Stripe version:', stripe.VERSION);
    console.log('[Checkout] Stripe config:', {
      apiVersion: stripe.VERSION,
      typescript: true,
      appInfo: stripe.getClientUserAgent()
    });

    const formattedLineItems = lineItems.map(item => ({
      price_data: {
        currency: item.currency,
        product_data: {
          name: item.name,
          description: item.description
        },
        unit_amount: item.amount
      },
      quantity: item.quantity || 1
    }))

    try {
      console.log('[Checkout] Creating Stripe session with:', {
        payment_method_types: ['card'],
        mode: 'payment',
        lineItems: formattedLineItems
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        submit_type: 'pay',
        billing_address_collection: 'required',
        phone_number_collection: { enabled: true },
        line_items: formattedLineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
        metadata,
        client_reference_id: `booking_${Date.now()}`
      })

      console.log('[Checkout] Created session:', session.id)
      return NextResponse.json({ sessionId: session.id })
    } catch (stripeError) {
      console.error('[Checkout] Stripe Error:', {
        type: stripeError.type,
        message: stripeError.message,
        code: stripeError.code,
        raw: stripeError.raw
      })
      throw stripeError
    }

  } catch (err) {
    console.error('[Checkout] Error:', err)
    console.error('[Checkout] Line items:', lineItems)
    console.error('[Checkout] Metadata:', metadata)
    console.error('[Checkout] Full error details:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      stripeKey: process.env.STRIPE_SECRET_KEY?.substring(0, 10) + '...',
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY
    })
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}