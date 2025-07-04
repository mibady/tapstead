import Stripe from 'stripe'

// Validate required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
}

// Initialize Stripe with the secret key (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
  locale: 'en', // Explicitly set the locale to English
})

// Export publishable key for client-side usage
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'] as const,
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