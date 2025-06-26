'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Check, Lock, Shield, AlertCircle } from 'lucide-react'
import { createSubscription } from '@/lib/actions/payment-actions'
import { SUBSCRIPTION_PLANS, SubscriptionPlanId } from '@/lib/stripe/config'
import { formatCurrency } from '@/lib/stripe/client'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_Stripe_Publishable_key || ''
)

interface StripeSubscriptionFormProps {
  planId: SubscriptionPlanId
  onSuccess: () => void
  onCancel: () => void
}

export function StripeSubscriptionForm({ planId, onSuccess, onCancel }: StripeSubscriptionFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const plan = SUBSCRIPTION_PLANS[planId]

  const handleCreateSubscription = async () => {
    try {
      setLoading(true)
      setError('')

      const result = await createSubscription({ planId })

      if (result.success) {
        setClientSecret(result.clientSecret!)
      } else {
        setError(result.message || 'Failed to create subscription')
        setLoading(false)
      }
    } catch (err) {
      setError('Failed to create subscription. Please try again.')
      setLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Plan Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{plan.name}</CardTitle>
              <Badge variant="secondary">{formatCurrency(plan.price)}/month</Badge>
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Monthly subscription</span>
                <span>{formatCurrency(plan.price)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total per month</span>
                <span>{formatCurrency(plan.price)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleCreateSubscription} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </>
                ) : (
                  `Subscribe for ${formatCurrency(plan.price)}/month`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{plan.name}</span>
            <Badge>{formatCurrency(plan.price)}/month</Badge>
          </CardTitle>
          <CardDescription>Complete your subscription setup</CardDescription>
        </CardHeader>
      </Card>

      {/* Payment Form */}
      <Elements stripe={stripePromise} options={options}>
        <SubscriptionPaymentForm 
          planId={planId}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </div>
  )
}

function SubscriptionPaymentForm({ 
  planId, 
  onSuccess, 
  onCancel 
}: { 
  planId: SubscriptionPlanId
  onSuccess: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')

  const plan = SUBSCRIPTION_PLANS[planId]

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError('')

    try {
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
        // Subscription payment successful
        onSuccess()
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Subscription payment error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Complete Subscription
        </CardTitle>
        <CardDescription>
          Set up your payment method for {plan.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3 text-sm text-gray-600">
            <p>• Your subscription will start immediately</p>
            <p>• You'll be charged {formatCurrency(plan.price)} every month</p>
            <p>• Cancel anytime from your account settings</p>
            <p>• First payment secures your subscription</p>
          </div>

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

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
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
                `Start Subscription - ${formatCurrency(plan.price)}/month`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}