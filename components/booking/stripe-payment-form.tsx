"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Lock } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentFormProps {
  bookingData: any
  billingAddress: any
  onPaymentSuccess: (paymentData: any) => void
}

function PaymentForm({ bookingData, billingAddress, onPaymentSuccess }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string>("")

  const isRecurring = bookingData.frequency?.id !== "one-time"
  const pricing = bookingData.pricing

  useEffect(() => {
    // Create payment intent or subscription setup
    const createPaymentIntent = async () => {
      try {
        const endpoint = isRecurring ? "/api/stripe/create-subscription" : "/api/stripe/create-payment-intent"

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(pricing.finalPrice * 100), // Convert to cents
            frequency: bookingData.frequency?.id,
            bookingData,
            billingAddress,
          }),
        })

        const data = await response.json()

        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError("Failed to initialize payment")
        }
      } catch (err) {
        setError("Failed to initialize payment")
      }
    }

    if (pricing?.finalPrice) {
      createPaymentIntent()
    }
  }, [pricing, isRecurring, bookingData, billingAddress])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError("Card element not found")
      setIsProcessing(false)
      return
    }

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${billingAddress.firstName} ${billingAddress.lastName}`,
            address: billingAddress.sameAsService
              ? {
                  line1: bookingData.address,
                }
              : {
                  line1: billingAddress.address,
                  city: billingAddress.city,
                  state: billingAddress.state,
                  postal_code: billingAddress.zipCode,
                },
          },
        },
      })

      if (paymentError) {
        setError(paymentError.message || "Payment failed")
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess({
          paymentIntentId: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
        })
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Card Information</span>
              <Lock className="w-4 h-4 text-gray-400" />
            </div>

            <div className="p-4 border rounded-lg">
              <CardElement options={cardElementOptions} />
            </div>

            <div className="text-xs text-gray-500">
              Your payment information is encrypted and secure. We use Stripe for payment processing.
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {isRecurring ? `${bookingData.frequency?.name} Subscription` : "One-time Payment"}
            </span>
            <span className="text-lg font-bold text-green-600">${pricing?.finalPrice}</span>
          </div>
          {isRecurring && (
            <div className="text-sm text-gray-600 mt-1">
              Automatically renews every{" "}
              {bookingData.frequency?.id === "weekly"
                ? "week"
                : bookingData.frequency?.id === "biweekly"
                  ? "2 weeks"
                  : "month"}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!stripe || isProcessing || !clientSecret}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              {isRecurring ? `Subscribe for $${pricing?.finalPrice}` : `Pay $${pricing?.finalPrice}`}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export function StripePaymentForm({ bookingData, billingAddress, onPaymentSuccess }: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm bookingData={bookingData} billingAddress={billingAddress} onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  )
}
