import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Service pricing configuration
const SERVICES = {
  oneTime: {
    '1-2': { price: 149, productId: 'prod_Sb12PLJ0A1LqCG' },
    '3-4': { price: 199, productId: 'prod_Sb13pjCHAoKvfH' },
    '5+': { price: 299, productId: 'prod_Sb14WX6Z00Lm03' }
  },
  weekly: {
    '1-2': { price: 99, productId: 'prod_Sb17TbF8GPiVup' },
    '3-4': { price: 149, productId: 'prod_Sb18qm2WYFPL54' },
    '5+': { price: 199, productId: 'prod_Sb19b4GQXy8ida' }
  },
  biWeekly: {
    '1-2': { price: 109, productId: 'prod_Sb1BUZ29cgzC7M' },
    '3-4': { price: 159, productId: 'prod_Sb1DsWl4LphBiK' },
    '5+': { price: 219, productId: 'prod_Sb1EWMyr1guvit' }
  },
  monthly: {
    '1-2': { price: 119, productId: 'prod_Sb1FkY1IlJNdUq' },
    '3-4': { price: 169, productId: 'prod_Sb1F7kMgxpCxkP' },
    '5+': { price: 239, productId: 'prod_Sb1GKzVhdUvnjt' }
  }
} as const

// Add-on pricing configuration
const ADDONS = {
  deepClean: { price: 75, productId: 'prod_Sb1JGVxMBfKm81' },
  moveInOut: { price: 99, productId: 'prod_Sb1MrGld1Aytkk' }
} as const

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { frequency, bedrooms, date, time, contact, address, addOns = [] } = req.body

    // Validate required fields
    if (!frequency || !bedrooms || !date || !time || !contact || !address) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get service pricing
    const service = SERVICES[frequency as keyof typeof SERVICES]?.[bedrooms as keyof typeof SERVICES['oneTime']]
    if (!service) {
      return res.status(400).json({ error: 'Invalid frequency or bedrooms selection' })
    }

    // Calculate add-ons total
    const selectedAddons = addOns
      .map(addon => ADDONS[addon as keyof typeof ADDONS])
      .filter(Boolean)

    // Create line items
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product: service.productId,
          unit_amount: service.price * 100,
        },
        quantity: 1,
      },
      ...selectedAddons.map(addon => ({
        price_data: {
          currency: 'usd',
          product: addon.productId,
          unit_amount: addon.price * 100,
        },
        quantity: 1,
      })),
    ]

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
      metadata: {
        serviceType: frequency,
        bedrooms,
        date: new Date(date).toISOString(),
        time: new Date(time).toISOString(),
        addOns: addOns.join(','),
        customerName: contact.name,
        customerEmail: contact.email,
        customerPhone: contact.phone,
        address: JSON.stringify({
          street: address.street,
          apt: address.apt,
          city: address.city,
          state: address.state,
          zip: address.zip,
        }),
      },
    })

    res.status(200).json({ sessionId: session.id })
  } catch (err) {
    console.error('Error creating checkout session:', err)
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Failed to create checkout session' 
    })
  }
}