'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Lock, Shield, AlertCircle } from 'lucide-react'
import { createPaymentIntent, confirmPayment } from '@/lib/actions/payment-actions'
import { formatCurrency, calculateTax, applyDiscount } from '@/lib/stripe/client'

// Load Stripe with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_Stripe_Publishable_key || ''
)

interface StripePaymentFormProps {
  onNext: (data: any) => void
  onBack: () => void
  bookingData: any
}

export function StripePaymentForm({ onNext, onBack, bookingData }: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Calculate pricing
  const basePrice = bookingData.details?.estimatedPrice || bookingData.service?.base_price || 0
  const discountPercent = bookingData.customer?.appliedDiscount || 0
  const discountedPrice = applyDiscount(basePrice * 100, discountPercent) // Convert to cents
  const tax = calculateTax(discountedPrice)
  const totalAmount = discountedPrice + tax

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntentForBooking()
  }, [])

  const createPaymentIntentForBooking = async () => {
    try {
      setLoading(true)
      setError('')

      const result = await createPaymentIntent({
        amount: totalAmount,
        currency: 'usd',
        bookingId: bookingData.bookingId || 'temp-booking-id',
        description: `Tapstead service: ${bookingData.service?.title || 'Service booking'}`,
        metadata: {
          service_type: bookingData.service?.title || '',
          booking_date: bookingData.details?.date || '',
          customer_name: `${bookingData.customer?.firstName || ''} ${bookingData.customer?.lastName || ''}`,
        },
      })

      if (result.success) {
        setClientSecret(result.clientSecret!)
      } else {
        setError(result.message || 'Failed to initialize payment')
      }
    } catch (err) {
      setError('Failed to initialize payment. Please try again.')
      console.error('Payment intent creation error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Secure Payment
          </CardTitle>
          <CardDescription>
            Setting up secure payment processing...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !clientSecret) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Payment Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-600">{error || 'Unable to initialize payment'}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={createPaymentIntentForBooking}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stripeAppearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  }

  const options = {
    clientSecret,
    appearance: stripeAppearance,
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>{bookingData.service?.title || 'Service'}</span>
            <span>{formatCurrency(basePrice * 100)}</span>
          </div>
          
          {discountPercent > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountPercent}%)</span>
              <span>-{formatCurrency((basePrice * 100) - discountedPrice)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm 
          onNext={onNext} 
          onBack={onBack} 
          bookingData={bookingData}
          totalAmount={totalAmount}
        />
      </Elements>
    </div>
  )
}

// Separate component for the payment form that uses Stripe hooks
function PaymentForm({ 
  onNext, 
  onBack, 
  bookingData, 
  totalAmount 
}: { 
  onNext: (data: any) => void
  onBack: () => void
  bookingData: any
  totalAmount: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        setIsProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment in our system
        const result = await confirmPayment(paymentIntent.id)
        
        if (result.success) {
          // Payment successful, proceed to confirmation
          onNext({
            ...bookingData,
            payment: {
              status: 'paid',
              amount: totalAmount / 100,
              paymentIntentId: paymentIntent.id,
              method: 'card',
            },
          })
        } else {
          setError(result.message || 'Payment confirmation failed')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Payment error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Your payment information is encrypted and secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stripe Payment Element */}
          <div className="space-y-4">
            <PaymentElement />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isProcessing}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                `Pay ${formatCurrency(totalAmount)}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}