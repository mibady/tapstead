import { describe, it, expect, beforeEach, vi } from "vitest"
import { calculatePricing, validatePricingOptions, type PricingOptions } from "@/lib/pricing/calculator"

// Mock Redis
vi.mock("@/lib/cache/redis", () => ({
  getCachedData: vi.fn().mockResolvedValue(null),
  setCachedData: vi.fn().mockResolvedValue(true),
  CACHE_KEYS: {
    PRICING: (size: string, frequency: string, addons: string) => `pricing:${size}:${frequency}:${addons}`,
  },
  CACHE_TTL: {
    PRICING: 3600,
  },
}))

describe("Pricing Calculator", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("calculatePricing", () => {
    it("should calculate basic pricing for small one-time cleaning", async () => {
      const options: PricingOptions = {
        size: "small",
        frequency: "one-time",
        addons: {},
      }

      const result = await calculatePricing(options)

      expect(result.basePrice).toBe(149)
      expect(result.subscriptionDiscount).toBe(0)
      expect(result.addonsCost).toBe(0)
      expect(result.weekendSurcharge).toBe(0)
      expect(result.sameDaySurcharge).toBe(0)
      expect(result.totalPrice).toBe(149)
      expect(result.stripeProductId).toBe("prod_Sb12PLJ0A1LqCG")
    })

    it("should apply weekly subscription discount", async () => {
      const options: PricingOptions = {
        size: "medium",
        frequency: "weekly",
        addons: {},
      }

      const result = await calculatePricing(options)

      expect(result.basePrice).toBe(199)
      expect(result.subscriptionDiscount).toBe(199 * 0.33) // 33% discount
      expect(result.totalPrice).toBe(199 - 199 * 0.33)
      expect(result.stripeProductId).toBe("prod_Sb16PQR012STU")
    })

    it("should add deep clean addon cost", async () => {
      const options: PricingOptions = {
        size: "large",
        frequency: "monthly",
        addons: {
          deepClean: true,
        },
      }

      const result = await calculatePricing(options)

      expect(result.basePrice).toBe(299)
      expect(result.subscriptionDiscount).toBe(299 * 0.2) // 20% monthly discount
      expect(result.addonsCost).toBe(75)
      expect(result.totalPrice).toBe(299 - 299 * 0.2 + 75)
    })

    it("should apply weekend surcharge", async () => {
      const options: PricingOptions = {
        size: "small",
        frequency: "one-time",
        addons: {},
        isWeekend: true,
      }

      const result = await calculatePricing(options)

      expect(result.weekendSurcharge).toBe(149 * 0.1) // 10% weekend surcharge
      expect(result.totalPrice).toBe(149 + 149 * 0.1)
    })

    it("should apply same-day surcharge", async () => {
      const options: PricingOptions = {
        size: "medium",
        frequency: "biweekly",
        addons: {},
        isSameDay: true,
      }

      const result = await calculatePricing(options)

      expect(result.sameDaySurcharge).toBe(199 * 0.15) // 15% same-day surcharge
      expect(result.subscriptionDiscount).toBe(199 * 0.27) // 27% biweekly discount
      expect(result.totalPrice).toBe(199 - 199 * 0.27 + 199 * 0.15)
    })

    it("should handle multiple addons", async () => {
      const options: PricingOptions = {
        size: "large",
        frequency: "one-time",
        addons: {
          deepClean: true,
          moveInOut: true,
        },
      }

      const result = await calculatePricing(options)

      expect(result.addonsCost).toBe(75 + 99) // Deep clean + Move in/out
      expect(result.totalPrice).toBe(299 + 75 + 99)
    })
  })

  describe("validatePricingOptions", () => {
    it("should validate correct options", () => {
      const options = {
        size: "medium" as const,
        frequency: "weekly" as const,
        addons: {},
      }

      expect(validatePricingOptions(options)).toBe(true)
    })

    it("should reject invalid size", () => {
      const options = {
        size: "invalid" as any,
        frequency: "weekly" as const,
        addons: {},
      }

      expect(validatePricingOptions(options)).toBe(false)
    })

    it("should reject missing frequency", () => {
      const options = {
        size: "small" as const,
        addons: {},
      }

      expect(validatePricingOptions(options)).toBe(false)
    })

    it("should reject missing addons", () => {
      const options = {
        size: "large" as const,
        frequency: "monthly" as const,
      }

      expect(validatePricingOptions(options)).toBe(false)
    })
  })
})
