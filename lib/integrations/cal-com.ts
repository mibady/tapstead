interface CalComBooking {
  id: number
  uid: string
  title: string
  status: string
  startTime: string
  endTime: string
  attendees: Array<{
    name: string
    email: string
    timeZone: string
  }>
}

interface BookingRequest {
  eventTypeId: number
  start: string
  end: string
  attendee: {
    name: string
    email: string
    timeZone: string
  }
  metadata?: Record<string, any>
}

interface AvailabilitySlot {
  start: string
  end: string
  available: boolean
}

class CalComService {
  private apiKey: string
  private baseUrl: string
  private username: string

  constructor() {
    this.apiKey = process.env.CAL_COM_API_KEY || ""
    this.baseUrl = "https://api.cal.com/v1"
    this.username = process.env.CAL_COM_USERNAME || "tapstead"
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Cal.com API error: ${response.statusText}`)
    }

    return response.json()
  }

  async checkAvailability(eventTypeId: number, startTime: string, endTime: string): Promise<AvailabilitySlot[]> {
    const params = new URLSearchParams({
      eventTypeId: eventTypeId.toString(),
      startTime,
      endTime,
    })

    const data = await this.makeRequest(`/availability?${params}`)
    return data.busy || []
  }

  async createBooking(bookingData: BookingRequest): Promise<CalComBooking> {
    const payload = {
      eventTypeId: bookingData.eventTypeId,
      start: bookingData.start,
      end: bookingData.end,
      responses: {
        name: bookingData.attendee.name,
        email: bookingData.attendee.email,
      },
      timeZone: bookingData.attendee.timeZone,
      language: "en",
      metadata: {
        ...bookingData.metadata,
        source: "tapstead",
      },
    }

    return this.makeRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async rescheduleBooking(bookingId: string, newStart: string, newEnd: string): Promise<CalComBooking> {
    return this.makeRequest(`/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify({
        start: newStart,
        end: newEnd,
      }),
    })
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    await this.makeRequest(`/bookings/${bookingId}`, {
      method: "DELETE",
      body: JSON.stringify({
        reason: reason || "Cancelled by customer",
      }),
    })
  }

  async getBooking(bookingId: string): Promise<CalComBooking> {
    return this.makeRequest(`/bookings/${bookingId}`)
  }

  getEmbedConfig(eventType: string, prefill?: { name?: string; email?: string }) {
    return {
      calLink: `${this.username}/${eventType}`,
      config: {
        name: prefill?.name || "",
        email: prefill?.email || "",
        theme: "light",
      },
    }
  }

  async getEventTypes() {
    return this.makeRequest("/event-types")
  }
}

export const calComService = new CalComService()
