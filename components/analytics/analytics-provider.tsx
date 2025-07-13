"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void
  identify: (userId: string, properties?: Record<string, any>) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initialize client-side analytics without exposing sensitive keys
    const initAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics/posthog")
        const config = await response.json()

        if (config.initialized) {
          setInitialized(true)
        }
      } catch (error) {
        console.error("Failed to initialize analytics:", error)
      }
    }

    initAnalytics()
  }, [])

  const track = async (event: string, properties?: Record<string, any>) => {
    if (!initialized) return

    try {
      await fetch("/api/analytics/posthog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event, properties }),
      })
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  }

  const identify = async (userId: string, properties?: Record<string, any>) => {
    if (!initialized) return

    try {
      await fetch("/api/analytics/posthog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "$identify",
          properties: { userId, ...properties },
        }),
      })
    } catch (error) {
      console.error("Failed to identify user:", error)
    }
  }

  return <AnalyticsContext.Provider value={{ track, identify }}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
