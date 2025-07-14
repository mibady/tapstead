import { describe, it, expect, beforeEach, vi } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/bookings/route"

// Mock dependencies
vi.mock("@/lib/cache/redis", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 9 }),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "test-user-id", email: "test@example.com" } },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        data: { id: "booking-123" },
        error: null,
      }),
    }),
  }),
}))

vi.mock("@/lib/pricing/calculator", () => ({
  calculatePricing: vi.fn().mockResolvedValue({
    basePrice: 149,
    subscriptionDiscount: 0,
    addonsCost: 0,
    weekendSurcharge: 0,
    sameDaySurcharge: 0,
    totalPrice: 149,
    stripeProductId: "prod_Sb12PLJ0A1LqCG",
  }),
  validatePricingOptions: vi.fn().mockReturnValue(true),
}))

describe("/api/bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST", () => {
    it("should create a booking successfully", async () => {
      const requestBody = {
        size: "small",
        frequency: "one-time",
        addons: {},
        scheduledDate: "2024-01-15T10:00:00Z",
        address: {
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
        },
        customerInfo: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "555-0123",
        },
      }

      const request = new NextRequest("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "127.0.0.1",
        },
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.booking).toBeDefined()
      expect(data.pricing).toBeDefined()
    })

    it("should handle rate limiting", async () => {
      const { checkRateLimit } = await import("@/lib/cache/redis")
      vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0 })

      const request = new NextRequest("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "127.0.0.1",
        },
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe("Too many requests")
    })

    it("should validate required fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "127.0.0.1",
        },
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain("validation")
    })
  })
})
