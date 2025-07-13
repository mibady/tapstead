import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/ai/chat/route"
import { NextRequest } from "next/server"

// Mock the AI service
vi.mock("@/lib/ai/agents", () => ({
  aiAgentService: {
    processMessage: vi.fn(),
    streamResponse: vi.fn(),
  },
}))

describe("/api/ai/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET", () => {
    it("should return API status and capabilities", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("AI Chat API is active")
      expect(data.availableAgents).toEqual(["booking", "support", "recruiting", "analytics"])
      expect(data.capabilities).toBeDefined()
      expect(data.timestamp).toBeDefined()
    })
  })

  describe("POST", () => {
    it("should process booking agent message", async () => {
      const { aiAgentService } = await import("@/lib/ai/agents")

      vi.mocked(aiAgentService.processMessage).mockResolvedValueOnce({
        content: "I can help you book a house cleaning service. What size is your home?",
        actions: [{ type: "initiate_booking", params: { service: "house-cleaning" } }],
        confidence: 0.9,
        needsEscalation: false,
      })

      const requestBody = {
        message: "I need house cleaning",
        agentType: "booking",
        context: {
          sessionId: "test-session",
          conversationHistory: [],
          metadata: {},
        },
      }

      const request = new NextRequest("http://localhost:3000/api/ai/chat", {
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
      expect(data.response).toContain("house cleaning")
      expect(data.confidence).toBe(0.9)
      expect(data.needsEscalation).toBe(false)
      expect(data.agentType).toBe("booking")
    })

    it("should handle missing message", async () => {
      const requestBody = {
        agentType: "booking",
        // missing message
      }

      const request = new NextRequest("http://localhost:3000/api/ai/chat", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing message or agentType")
    })

    it("should handle invalid agent type", async () => {
      const requestBody = {
        message: "Hello",
        agentType: "invalid-agent",
      }

      const request = new NextRequest("http://localhost:3000/api/ai/chat", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain("Invalid agent type")
    })

    it("should handle support agent escalation", async () => {
      const { aiAgentService } = await import("@/lib/ai/agents")

      vi.mocked(aiAgentService.processMessage).mockResolvedValueOnce({
        content: "I understand your frustration. Let me connect you with a manager.",
        actions: [{ type: "escalate_to_human", params: { priority: "high" } }],
        confidence: 0.3,
        needsEscalation: true,
      })

      const requestBody = {
        message: "I want a refund immediately!",
        agentType: "support",
        context: {
          sessionId: "test-session",
          conversationHistory: [],
          metadata: {},
        },
      }

      const request = new NextRequest("http://localhost:3000/api/ai/chat", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.needsEscalation).toBe(true)
      expect(data.confidence).toBe(0.3)
    })
  })
})
