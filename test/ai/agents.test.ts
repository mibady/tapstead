import { describe, it, expect, vi, beforeEach } from "vitest"
import { aiAgentService } from "@/lib/ai/agents"

// Mock the AI SDK
vi.mock("ai", () => ({
  generateText: vi.fn(),
  streamText: vi.fn(),
}))

vi.mock("@ai-sdk/openai", () => ({
  openai: vi.fn(() => "mocked-openai-model"),
}))

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "mocked-anthropic-model"),
}))

describe("AI Agents", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Booking Agent", () => {
    it("should process booking message successfully", async () => {
      const { generateText } = await import("ai")
      vi.mocked(generateText).mockResolvedValueOnce({
        text: "I can help you book a house cleaning service. What size is your home?",
      })

      const context = {
        sessionId: "session-123",
        conversationHistory: [],
        metadata: {},
      }

      const result = await aiAgentService.processMessage("booking", "I need house cleaning", context)

      expect(result.content).toContain("house cleaning")
      expect(result.confidence).toBeGreaterThan(0.5)
      expect(result.needsEscalation).toBe(false)
    })

    it("should identify booking actions", async () => {
      const { generateText } = await import("ai")
      vi.mocked(generateText).mockResolvedValueOnce({
        text: "Great! Let me help you book a cleaning service for next Tuesday.",
      })

      const context = {
        sessionId: "session-123",
        conversationHistory: [],
        metadata: { homeSize: "medium" },
      }

      const result = await aiAgentService.processMessage("booking", "I want to book for Tuesday", context)

      expect(result.actions).toBeDefined()
      expect(result.confidence).toBeGreaterThan(0.8)
    })

    it("should handle booking agent errors gracefully", async () => {
      const { generateText } = await import("ai")
      vi.mocked(generateText).mockRejectedValueOnce(new Error("API Error"))

      const context = {
        sessionId: "session-123",
        conversationHistory: [],
        metadata: {},
      }

      const result = await aiAgentService.processMessage("booking", "Help me book", context)

      expect(result.needsEscalation).toBe(true)
      expect(result.confidence).toBe(0)
      expect(result.content).toContain("human agent")
    })
  })

  describe("Support Agent", () => {
    it("should handle support inquiries", async () => {
      const { generateText } = await import("ai")
      vi.mocked(generateText).mockResolvedValueOnce({
        text: "I understand your concern about the service quality. Let me help resolve this issue.",
      })

      const context = {
        sessionId: "session-456",
        conversationHistory: [],
        metadata: {},
      }

      const result = await aiAgentService.processMessage("support", "I had issues with my cleaning", context)

      expect(result.content).toContain("concern")
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it("should escalate complaint keywords", async () => {
      const { generateText } = await import("ai")
      vi.mocked(generateText).mockResolvedValueOnce({
        text: "I understand you want a refund. Let me connect you with a manager.",
      })

      const context = {
        sessionId: "session-456",
        conversationHistory: [],
        metadata: {},
      }

      const result = await aiAgentService.processMessage("support", "I want a refund immediately!", context)

      expect(result.needsEscalation).toBe(true)
    })
  })

  describe("Recruiting Agent", () => {
    it("should handle provider inquiries", async () => {
      const { generateText } = await import("ai")
      vi.mocked(generateText).mockResolvedValueOnce({
        text: "Great to hear about your interest! Tell me about your experience in home services.",
      })

      const context = {
        sessionId: "session-789",
        conversationHistory: [],
        metadata: {},
      }

      const result = await aiAgentService.processMessage("recruiting", "I want to join as a provider", context)

      expect(result.content).toContain("experience")
      expect(result.confidence).toBeGreaterThan(0.7)
    })
  })

  describe("Analytics Agent", () => {
    it("should provide business insights", async () => {
      const { generateText } = await import("ai")
      vi.mocked(generateText).mockResolvedValueOnce({
        text: "Based on the data, bookings have increased 25% this month, primarily in the medium home category.",
      })

      const context = {
        sessionId: "session-101",
        conversationHistory: [],
        metadata: {},
      }

      const result = await aiAgentService.processMessage("analytics", "Show me booking trends", context)

      expect(result.content).toContain("25%")
      expect(result.confidence).toBeGreaterThan(0.7)
    })
  })

  describe("Agent Service", () => {
    it("should throw error for invalid agent type", async () => {
      const context = {
        sessionId: "session-123",
        conversationHistory: [],
        metadata: {},
      }

      await expect(aiAgentService.processMessage("invalid" as any, "test message", context)).rejects.toThrow(
        "Unknown agent type: invalid",
      )
    })
  })
})
