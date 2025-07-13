import { describe, it, expect, vi, beforeEach } from "vitest"
import { retellService } from "@/lib/integrations/retell-ai"

global.fetch = vi.fn()

describe("Retell AI Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("initiateCall", () => {
    it("should initiate call successfully", async () => {
      const mockResponse = {
        callId: "call-123",
        status: "initiated",
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const callRequest = {
        fromNumber: "+1234567890",
        toNumber: "+0987654321",
        agentId: "agent-123",
        metadata: { purpose: "booking" },
      }

      const result = await retellService.initiateCall(callRequest)

      expect(fetch).toHaveBeenCalledWith(
        "https://api.retellai.com/v2/call",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-retell-key",
            "Content-Type": "application/json",
          }),
        }),
      )
      expect(result).toEqual(mockResponse)
    })

    it("should handle call initiation errors", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      } as Response)

      const callRequest = {
        fromNumber: "+1234567890",
        toNumber: "+0987654321",
        agentId: "agent-123",
      }

      await expect(retellService.initiateCall(callRequest)).rejects.toThrow("Retell API error: Bad Request")
    })
  })

  describe("sendSMS", () => {
    it("should send SMS successfully", async () => {
      const mockResponse = {
        messageId: "msg-123",
        status: "sent",
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const smsRequest = {
        to: "+0987654321",
        message: "Your appointment is confirmed!",
        from: "+1234567890",
      }

      const result = await retellService.sendSMS(smsRequest)

      expect(fetch).toHaveBeenCalledWith(
        "https://api.retellai.com/v2/sms",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("Your appointment is confirmed!"),
        }),
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe("Agent Configurations", () => {
    it("should return booking agent config", () => {
      const config = retellService.getBookingAgent()

      expect(config.name).toBe("Tapstead Booking Assistant")
      expect(config.voice).toBe("11labs-Adrian")
      expect(config.language).toBe("en-US")
      expect(config.prompt).toContain("booking assistant")
      expect(config.enableRecording).toBe(true)
    })

    it("should return support agent config", () => {
      const config = retellService.getSupportAgent()

      expect(config.name).toBe("Tapstead Support Agent")
      expect(config.voice).toBe("11labs-Rachel")
      expect(config.firstMessage).toContain("help with any questions")
    })

    it("should return recruiting agent config", () => {
      const config = retellService.getRecruitingAgent()

      expect(config.name).toBe("Tapstead Provider Recruiter")
      expect(config.voice).toBe("11labs-Josh")
      expect(config.prompt).toContain("recruiting agent")
    })
  })
})
