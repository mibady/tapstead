import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from "@/lib/cache/redis"

export interface PricingOptions {
  size: "small" | "medium" | "large"
  frequency: "one-time" | "weekly" | "biweekly" | "monthly"
  addons: {
    deepClean?: boolean
    moveInOut?: boolean
  }
  isWeekend?: boolean
  isSameDay?: boolean
}

export interface PricingResult {
  basePrice: number
  subscriptionDiscount: number
  addonsCost: number
  weekendSurcharge: number
  sameDaySurcharge: number
  totalPrice: number
  stripeProductId: string
}

// Base prices for house cleaning
const BASE_PRICES = {
  small: 149,
  medium: 199,
  large: 299,
} as const

// Subscription discounts
const SUBSCRIPTION_DISCOUNTS = {
  "one-time": 0,
  weekly: 0.33,
  biweekly: 0.27,
  monthly: 0.2,
} as const

// Add-on prices
const ADDON_PRICES = {
  deepClean: 75,
  moveInOut: 99,
} as const

// Stripe Product IDs - CRITICAL: These must match exactly with Stripe
const STRIPE_PRODUCT_IDS = {
  // One-time cleanings
  "small-one-time": "prod_Sb12PLJ0A1LqCG",
  "medium-one-time": "prod_Sb13XYZ123ABC",
  "large-one-time": "prod_Sb14DEF456GHI",

  // Weekly subscriptions
  "small-weekly": "prod_Sb15JKL789MNO",
  "medium-weekly": "prod_Sb16PQR012STU",
  "large-weekly": "prod_Sb17VWX345YZA",

  // Bi-weekly subscriptions
  "small-biweekly": "prod_Sb18BCD678EFG",
  "medium-biweekly": "prod_Sb19HIJ901KLM",
  "large-biweekly": "prod_Sb20NOP234QRS",

  // Monthly subscriptions
  "small-monthly": "prod_Sb21TUV567WXY",
  "medium-monthly": "prod_Sb22ZAB890CDE",
  "large-monthly": "prod_Sb23FGH123IJK",
} as const

export class PricingCalculator {
  static async calculatePricing(options: PricingOptions): Promise<PricingResult> {
    const { size, frequency, addons, isWeekend = false, isSameDay = false } = options

    // Create cache key
    const addonKey = Object.entries(addons)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key)
      .sort()
      .join(",")

    const cacheKey = CACHE_KEYS.PRICING(size, frequency, addonKey)

    // Try to get from cache first
    const cached = await getCachedData<PricingResult>(cacheKey)
    if (cached && !isWeekend && !isSameDay) {
      return cached
    }

    // Calculate pricing
    const basePrice = BASE_PRICES[size]
    const subscriptionDiscount = basePrice * SUBSCRIPTION_DISCOUNTS[frequency]

    // Calculate add-ons
    let addonsCost = 0
    if (addons.deepClean) addonsCost += ADDON_PRICES.deepClean
    if (addons.moveInOut) addonsCost += ADDON_PRICES.moveInOut

    // Calculate surcharges
    const weekendSurcharge = isWeekend ? basePrice * 0.1 : 0
    const sameDaySurcharge = isSameDay ? basePrice * 0.15 : 0

    // Calculate total
    const totalPrice = basePrice - subscriptionDiscount + addonsCost + weekendSurcharge + sameDaySurcharge

    // Get Stripe Product ID
    const productKey = `${size}-${frequency}` as keyof typeof STRIPE_PRODUCT_IDS
    const stripeProductId = STRIPE_PRODUCT_IDS[productKey]

    if (!stripeProductId) {
      throw new Error(`No Stripe Product ID found for ${size} ${frequency} cleaning`)
    }

    const result: PricingResult = {
      basePrice,
      subscriptionDiscount,
      addonsCost,
      weekendSurcharge,
      sameDaySurcharge,
      totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
      stripeProductId,
    }

    // Cache the result (only if no surcharges)
    if (!isWeekend && !isSameDay) {
      await setCachedData(cacheKey, result, CACHE_TTL.PRICING)
    }

    return result
  }

  static validatePricingOptions(options: Partial<PricingOptions>): options is PricingOptions {
    if (!options.size || !["small", "medium", "large"].includes(options.size)) {
      return false
    }

    if (!options.frequency || !["one-time", "weekly", "biweekly", "monthly"].includes(options.frequency)) {
      return false
    }

    if (!options.addons || typeof options.addons !== "object") {
      return false
    }

    return true
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  static toCents(price: number): number {
    return Math.round(price * 100)
  }
}

// Legacy function exports for backward compatibility
export async function calculatePricing(options: PricingOptions): Promise<PricingResult> {
  return PricingCalculator.calculatePricing(options)
}

export function validatePricingInput(options: Partial<PricingOptions>): options is PricingOptions {
  return PricingCalculator.validatePricingOptions(options)
}

export function validatePricingOptions(options: Partial<PricingOptions>): options is PricingOptions {
  return PricingCalculator.validatePricingOptions(options)
}
