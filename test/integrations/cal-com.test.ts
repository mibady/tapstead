import { describe, it, expect, vi, beforeEach } from "vitest"
import { calComService } from "@/lib/integrations/cal-com"

// Mock fetch globally
global.fetch = vi.fn()

describe("Cal.com Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("checkAvailability", () => {
    it("should fetch availability successfully", async () => {
      const mockResponse = {
        busy: [{ start: "2024-01-15T10:00:00Z", end: "2024-01-15T11:00:00Z", available: false }],
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await calComService.checkAvailability(123, "2024-01-15T00:00:00Z", "2024-01-15T23:59:59Z")

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/availability"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-cal-com-key",
            "Content-Type": "application/json",
          }),
        }),
      )
      expect(result).toEqual(mockResponse.busy)
    })

    it("should handle API errors", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: "Unauthorized",
      } as Response)

      await expect(
        calComService.checkAvailability(123, "2024-01-15T00:00:00Z", "2024-01-15T23:59:59Z"),
      ).rejects.toThrow("Cal.com API error: Unauthorized")
    })
  })

  describe("createBooking", () => {
    it("should create booking successfully", async () => {
      const mockBooking = {
        id: 456,
        uid: "booking-uid-123",
        title: "House Cleaning",
        status: "confirmed",
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBooking,
      } as Response)

      const bookingData = {
        eventTypeId: 123,
        start: "2024-01-15T10:00:00Z",
        end: "2024-01-15T11:00:00Z",
        attendee: {
          name: "John Doe",
          email: "john@example.com",
          timeZone: "America/New_York",
        },
        metadata: { service: "house-cleaning" },
      }

      const result = await calComService.createBooking(bookingData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/bookings"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-cal-com-key",
            "Content-Type": "application/json",
          }),
          body: expect.stringContaining("john@example.com"),
        }),
      )
      expect(result).toEqual(mockBooking)
    })
  })

  describe("getEmbedConfig", () => {
    it("should return correct embed configuration", () => {
      const config = calComService.getEmbedConfig("house-cleaning", {
        name: "Jane Doe",
        email: "jane@example.com",
      })

      expect(config).toEqual({
        calLink: "tapstead/house-cleaning",
        config: {
          name: "Jane Doe",
          email: "jane@example.com",
          theme: "light",
        },
      })
    })
  })
})
