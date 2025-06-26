import Stripe from 'stripe'

// Validate required environment variables
const stripeSecretKey = process.env.Stripe_Secret_key
const stripePublishableKey = process.env.NEXT_PUBLIC_Stripe_Publishable_key || process.env.Stripe_Publishable_key

if (!stripeSecretKey) {
  console.error('Missing Stripe_Secret_key environment variable')
  throw new Error('Stripe configuration error: Missing secret key')
}

if (!stripePublishableKey) {
  console.error('Missing Stripe_Publishable_key environment variable')
  throw new Error('Stripe configuration error: Missing publishable key')
}

// Initialize Stripe with the secret key (server-side only)
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

// Export publishable key for client-side usage
export const STRIPE_PUBLISHABLE_KEY = stripePublishableKey

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card', 'apple_pay', 'google_pay'] as const,
  automatic_payment_methods: {
    enabled: true,
  },
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  'home-care-plus': {
    name: 'Home Care Plus',
    price: 4900, // $49.00 in cents
    interval: 'month' as const,
    description: '15% discount on all services',
    features: [
      '15% discount on all services',
      'Priority booking',
      'Free service consultations',
      'Monthly service reminders',
    ],
  },
  'premium-care': {
    name: 'Premium Care',
    price: 9900, // $99.00 in cents
    interval: 'month' as const,
    description: '25% discount on all services',
    features: [
      '25% discount on all services',
      'Priority booking',
      'Free service consultations',
      'Monthly service reminders',
      'Emergency service priority',
      'Dedicated account manager',
    ],
  },
} as const

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS