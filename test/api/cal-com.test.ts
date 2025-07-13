import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/cal-com/webhook/route"
import { NextRequest } from "next/server"

describe("/api/cal-com/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET", () => {
    it("should return webhook status", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Cal.com webhook endpoint is active")
      expect(data.timestamp).toBeDefined()
    })
  })

  describe("POST", () => {
    it("should handle booking created webhook", async () => {
      const webhookPayload = {
        triggerEvent: "BOOKING_CREATED",
        payload: {
          booking: {
            id: 123,
            uid: "booking-uid-123",
            startTime: "2024-01-15T10:00:00Z",
            endTime: "2024-01-15T11:00:00Z",
            attendees: [
              {
                name: "John Doe",
                email: "john@example.com",
                timeZone: "America/New_York",
              },
            ],
            metadata: {
              tapstead_booking_id: "tapstead-123",
            },
          },
        },
      }

      const request = new NextRequest("http://localhost:3000/api/cal-com/webhook", {
        method: "POST",
        body: JSON.stringify(webhookPayload),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it("should handle booking cancelled webhook", async () => {
      const webhookPayload = {
        triggerEvent: "BOOKING_CANCELLED",
        payload: {
          booking: {
            id: 123,
            uid: "booking-uid-123",
            status: "cancelled",
          },
        },
      }

      const request = new NextRequest("http://localhost:3000/api/cal-com/webhook", {
        method: "POST",
        body: JSON.stringify(webhookPayload),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it("should handle invalid webhook payload", async () => {
      const request = new NextRequest("http://localhost:3000/api/cal-com/webhook", {
        method: "POST",
        body: "invalid json",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Webhook processing failed")
    })
  })
})
