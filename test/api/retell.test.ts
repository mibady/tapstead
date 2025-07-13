import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST, PATCH } from "@/app/api/retell/call/route"
import { NextRequest } from "next/server"

// Mock the Retell service
vi.mock("@/lib/integrations/retell-ai", () => ({
  retellService: {
    initiateCall: vi.fn(),
    getCallDetails: vi.fn(),
  },
}))

describe("/api/retell/call", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET", () => {
    it("should get call details", async () => {
      const { retellService } = await import("@/lib/integrations/retell-ai")

      const mockCallDetails = {
        callId: "call-123",
        status: "completed",
        duration: 120,
        transcript: "Hello, how can I help you today?",
      }

      vi.mocked(retellService.getCallDetails).mockResolvedValueOnce(mockCallDetails)

      const url = new URL("http://localhost:3000/api/retell/call?callId=call-123")
      const request = new NextRequest(url)

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.call).toEqual(mockCallDetails)
    })

    it("should handle missing callId", async () => {
      const url = new URL("http://localhost:3000/api/retell/call")
      const request = new NextRequest(url)

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing callId parameter")
    })
  })

  describe("POST", () => {
    it("should initiate call successfully", async () => {
      const { retellService } = await import("@/lib/integrations/retell-ai")

      const mockCallResponse = {
        callId: "call-123",
        status: "initiated",
      }

      vi.mocked(retellService.initiateCall).mockResolvedValueOnce(mockCallResponse)

      const requestBody = {
        toNumber: "+1234567890",
        agentType: "booking",
        metadata: { purpose: "house-cleaning-inquiry" },
      }

      const request = new NextRequest("http://localhost:3000/api/retell/call", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.callId).toBe("call-123")
      expect(data.status).toBe("initiated")
    })

    it("should handle missing phone number", async () => {
      const requestBody = {
        agentType: "booking",
        // missing toNumber
      }

      const request = new NextRequest("http://localhost:3000/api/retell/call", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing toNumber")
    })
  })

  describe("PATCH", () => {
    it("should update call status", async () => {
      const requestBody = {
        callId: "call-123",
        status: "completed",
        duration: 180,
        transcript: "Call completed successfully",
      }

      const request = new NextRequest("http://localhost:3000/api/retell/call", {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe("Call status updated")
    })

    it("should handle missing callId in update", async () => {
      const requestBody = {
        status: "completed",
        // missing callId
      }

      const request = new NextRequest("http://localhost:3000/api/retell/call", {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing callId")
    })
  })
})
