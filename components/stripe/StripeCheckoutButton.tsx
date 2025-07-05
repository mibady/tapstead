'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'

import { FrequencyType, BedroomType } from '@/lib/booking/pricing'

interface StripeCheckoutButtonProps {
  frequency: FrequencyType
  bedrooms: BedroomType
  date: Date
  time: string
  contact: {
    name: string
    email: string
    phone: string
  }
  address: {
    street: string
    apt?: string
    city: string
    state: string
    zip: string
  }
  onSuccess?: () => void
  onError?: (error: Error) => void
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function StripeCheckoutButton({
  frequency,
  bedrooms,
  date,
  time,
  contact,
  address,
  onSuccess,
  onError
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frequency,
          bedrooms,
          date,
          time,
          contact,
          address,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }
      
      onSuccess?.()
    } catch (err) {
      console.error('Stripe checkout error:', err)
      onError?.(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Proceed to Payment'}
    </Button>
  )
}