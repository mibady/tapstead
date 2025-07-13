// Server-side PostHog utilities
export class PostHogServer {
  private apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.POSTHOG_KEY
  }

  async track(event: string, properties: Record<string, any>, userId?: string) {
    if (!this.apiKey) {
      console.warn("PostHog API key not configured")
      return
    }

    try {
      // Implement server-side PostHog tracking
      const response = await fetch("https://app.posthog.com/capture/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          event,
          properties: {
            ...properties,
            distinct_id: userId || "anonymous",
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`PostHog API error: ${response.status}`)
      }
    } catch (error) {
      console.error("PostHog tracking error:", error)
    }
  }

  async identify(userId: string, properties: Record<string, any>) {
    if (!this.apiKey) {
      console.warn("PostHog API key not configured")
      return
    }

    try {
      const response = await fetch("https://app.posthog.com/capture/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          event: "$identify",
          properties: {
            distinct_id: userId,
            $set: properties,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`PostHog API error: ${response.status}`)
      }
    } catch (error) {
      console.error("PostHog identify error:", error)
    }
  }
}

export const posthog = new PostHogServer()
