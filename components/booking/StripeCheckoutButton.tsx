'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Initialize Stripe with locale setting
// Make sure to initialize Stripe only once
const stripePromise = typeof window !== 'undefined' ?
  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!) :
  null

export default function StripeCheckoutButton({ lineItems, metadata, onSuccess }: { lineItems: any[], metadata: any, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    
    try {
      console.log('[Checkout] Starting checkout process...', {
        hasStripeKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10) + '...',
        lineItems,
        metadata
      })
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          lineItems,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString()
          },
        }),
      })
      
      const responseData = await response.json().catch(() => ({}))
      
      if (!response.ok) {
        console.error('[Checkout] API Error:', {
          status: response.status,
          statusText: response.statusText,
          response: responseData
        })
        
        const errorMessage = responseData?.error || 'Failed to process payment'
        toast.error(errorMessage)
        setLoading(false)
        return
      }

      const { sessionId } = responseData
      
      if (!sessionId) {
        console.error('[Checkout] No session ID in response:', responseData)
        toast.error('Invalid response from server')
        setLoading(false)
        return
      }

      console.log('[Checkout] Received session ID:', sessionId)
      
      const stripe = await stripePromise
      
      if (!stripe) {
        const errorMsg = 'Payment service is not available. Please try again later.'
        console.error('[Checkout] Stripe failed to initialize')
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      console.log('[Checkout] Redirecting to Stripe Checkout...')
      
      const { error } = await stripe.redirectToCheckout({ 
        sessionId,
      })
      
      if (error) {
        console.error('[Checkout] Stripe redirect error:', error)
        toast.error(error.message || 'Failed to redirect to payment')
        setLoading(false)
      } else {
        console.log('[Checkout] Successfully redirected to Stripe Checkout')
        onSuccess()
      }
    } catch (error) {
      console.error('[Checkout] Unexpected error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleCheckout}
      disabled={loading}
      className="w-full sm:w-auto"
      aria-busy={loading}
    >
      {loading ? 'Processing...' : 'Proceed to Payment'}
    </Button>
  )
}
