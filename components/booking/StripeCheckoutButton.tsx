'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function StripeCheckoutButton({ lineItems, metadata, onSuccess }: { lineItems: any[], metadata: any, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    const res = await fetch('/api/checkout/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineItems, metadata }),
    })
    
    if (res.status === 500) {
      console.error(await res.json());
      setLoading(false);
      return;
    }

    const { sessionId } = await res.json()
    const stripe = await stripePromise
    await stripe?.redirectToCheckout({ sessionId })
    onSuccess();
    setLoading(false)
  }

  return (
    <Button disabled={loading} onClick={handleCheckout}>
      {loading ? 'Loading...' : 'Proceed to Payment'}
    </Button>
  )
}
