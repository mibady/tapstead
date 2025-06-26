'use client'

import { loadStripe, Stripe } from '@stripe/stripe-js'

// Get publishable key from environment
const stripePublishableKey = process.env.NEXT_PUBLIC_Stripe_Publishable_key

if (!stripePublishableKey) {
  console.error('Missing NEXT_PUBLIC_Stripe_Publishable_key environment variable')
  throw new Error('Stripe configuration error: Missing publishable key')
}

// Create a singleton Stripe instance
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

// Helper function to format amounts for display
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100) // Convert from cents to dollars
}

// Helper function to calculate tax
export const calculateTax = (amount: number, taxRate = 0.08): number => {
  return Math.round(amount * taxRate)
}

// Helper function to apply discount
export const applyDiscount = (amount: number, discountPercent: number): number => {
  const discount = Math.round(amount * (discountPercent / 100))
  return amount - discount
}