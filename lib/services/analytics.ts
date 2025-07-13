export class Analytics {
  static track(event: string, properties?: Record<string, any>) {
    if (typeof window !== "undefined") {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag("event", event, properties)
      }

      // Custom analytics
      console.log("Analytics Event:", event, properties)
    }
  }

  static trackBooking(bookingData: any) {
    this.track("booking_created", {
      service: bookingData.service_title,
      price: bookingData.estimated_price,
      date: bookingData.scheduled_date,
    })
  }

  static trackSignup(method: string) {
    this.track("sign_up", {
      method: method,
    })
  }

  static trackPageView(page: string) {
    this.track("page_view", {
      page_title: page,
      page_location: window.location.href,
    })
  }
}

// Error tracking
export class ErrorTracker {
  static captureException(error: Error, context?: Record<string, any>) {
    console.error("Error captured:", error, context)

    // In production, send to error tracking service like Sentry
    if (process.env.NODE_ENV === "production") {
      // Sentry.captureException(error, { extra: context })
    }
  }

  static captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
    console.log(`[${level.toUpperCase()}] ${message}`)

    // In production, send to logging service
    if (process.env.NODE_ENV === "production") {
      // Sentry.captureMessage(message, level)
    }
  }
}
