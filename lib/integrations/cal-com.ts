interface CalComConfig {
  apiKey: string
  baseUrl: string
  username: string
}

interface CreateBookingRequest {
  eventTypeId: number
  start: string
  end: string
  attendee: {
    name: string
    email: string
    timeZone: string
  }
  metadata?: Record<string, any>
  customInputs?: Array<{
    label: string
    value: string
  }>
}

interface CreateBookingResponse {
  id: number
  uid: string
  title: string
  description: string
  startTime: string
  endTime: string
  attendees: Array<{
    name: string
    email: string
    timeZone: string
  }>
  organizer: {
    name: string
    email: string
    timeZone: string
  }
  location: string
  status: "ACCEPTED" | "PENDING" | "CANCELLED"
  metadata: Record<string, any>
}

interface GetAvailabilityRequest {
  eventTypeId: number
  startTime: string
  endTime: string
  timeZone?: string
}

interface AvailabilitySlot {
  start: string
  end: string
}

interface GetAvailabilityResponse {
  busy: Array<{
    start: string
    end: string
  }>
  timeZone: string
  workingHours: Array<{
    days: number[]
    startTime: number
    endTime: number
  }>
  dateOverrides: Array<{
    date: string
    startTime: number
    endTime: number
  }>
}

class CalComService {
  private config: CalComConfig

  constructor() {
    this.config = {
      apiKey: process.env.CAL_COM_API_KEY || "",
      baseUrl: process.env.CAL_COM_API_URL || "https://api.cal.com/v2",
      username: process.env.CAL_COM_USERNAME || "",
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Cal.com API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response.json()
  }

  // Booking Management
  async createBooking(request: CreateBookingRequest): Promise<CreateBookingResponse> {
    return this.makeRequest<CreateBookingResponse>("/bookings", {
      method: "POST",
      body: JSON.stringify({
        eventTypeId: request.eventTypeId,
        start: request.start,
        end: request.end,
        attendee: request.attendee,
        metadata: request.metadata,
        customInputs: request.customInputs,
      }),
    })
  }

  async getBooking(bookingId: string): Promise<CreateBookingResponse> {
    return this.makeRequest<CreateBookingResponse>(`/bookings/${bookingId}`)
  }

  async updateBooking(bookingId: string, updates: Partial<CreateBookingRequest>): Promise<CreateBookingResponse> {
    return this.makeRequest<CreateBookingResponse>(`/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    await this.makeRequest(`/bookings/${bookingId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  }

  async listBookings(params?: {
    status?: "upcoming" | "past" | "cancelled"
    limit?: number
    offset?: number
  }): Promise<{ bookings: CreateBookingResponse[] }> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append("status", params.status)
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.offset) searchParams.append("offset", params.offset.toString())

    const queryString = searchParams.toString()
    return this.makeRequest<{ bookings: CreateBookingResponse[] }>(`/bookings${queryString ? `?${queryString}` : ""}`)
  }

  // Availability Management
  async getAvailability(request: GetAvailabilityRequest): Promise<GetAvailabilityResponse> {
    const searchParams = new URLSearchParams({
      eventTypeId: request.eventTypeId.toString(),
      startTime: request.startTime,
      endTime: request.endTime,
    })

    if (request.timeZone) {
      searchParams.append("timeZone", request.timeZone)
    }

    return this.makeRequest<GetAvailabilityResponse>(`/availability?${searchParams.toString()}`)
  }

  async getAvailableSlots(params: {
    eventTypeId: number
    startTime: string
    endTime: string
    timeZone?: string
  }): Promise<AvailabilitySlot[]> {
    const availability = await this.getAvailability(params)

    // Convert availability data to available slots
    // This is a simplified implementation - you may need to adjust based on your needs
    const slots: AvailabilitySlot[] = []
    const startDate = new Date(params.startTime)
    const endDate = new Date(params.endTime)

    // Generate 30-minute slots during working hours
    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay()
      const workingHour = availability.workingHours.find((wh) => wh.days.includes(dayOfWeek))

      if (workingHour) {
        for (let hour = workingHour.startTime; hour < workingHour.endTime; hour += 30) {
          const slotStart = new Date(date)
          slotStart.setHours(Math.floor(hour / 60), hour % 60, 0, 0)

          const slotEnd = new Date(slotStart)
          slotEnd.setMinutes(slotEnd.getMinutes() + 30)

          // Check if slot conflicts with busy times
          const isConflict = availability.busy.some((busy) => {
            const busyStart = new Date(busy.start)
            const busyEnd = new Date(busy.end)
            return slotStart < busyEnd && slotEnd > busyStart
          })

          if (!isConflict) {
            slots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
            })
          }
        }
      }
    }

    return slots
  }

  // Event Type Management
  async getEventTypes(): Promise<any> {
    return this.makeRequest("/event-types")
  }

  async getEventType(eventTypeId: number): Promise<any> {
    return this.makeRequest(`/event-types/${eventTypeId}`)
  }

  // Helper methods for Tapstead-specific use cases
  async bookProviderAppointment(params: {
    providerId: string
    customerName: string
    customerEmail: string
    serviceType: string
    preferredDate: string
    duration: number
    notes?: string
  }): Promise<CreateBookingResponse> {
    // Get the appropriate event type for the service
    const eventTypeId = await this.getEventTypeForService(params.serviceType)

    const startTime = new Date(params.preferredDate)
    const endTime = new Date(startTime.getTime() + params.duration * 60000)

    return this.createBooking({
      eventTypeId,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      attendee: {
        name: params.customerName,
        email: params.customerEmail,
        timeZone: "America/New_York", // Default timezone - should be configurable
      },
      metadata: {
        providerId: params.providerId,
        serviceType: params.serviceType,
        source: "tapstead_platform",
      },
      customInputs: params.notes
        ? [
            {
              label: "Service Notes",
              value: params.notes,
            },
          ]
        : undefined,
    })
  }

  async getProviderAvailability(params: {
    providerId: string
    serviceType: string
    startDate: string
    endDate: string
  }): Promise<AvailabilitySlot[]> {
    const eventTypeId = await this.getEventTypeForService(params.serviceType)

    return this.getAvailableSlots({
      eventTypeId,
      startTime: params.startDate,
      endTime: params.endDate,
    })
  }

  async rescheduleAppointment(params: {
    bookingId: string
    newStartTime: string
    newEndTime: string
    reason?: string
  }): Promise<CreateBookingResponse> {
    return this.updateBooking(params.bookingId, {
      start: params.newStartTime,
      end: params.newEndTime,
      metadata: {
        reschedule_reason: params.reason,
        rescheduled_at: new Date().toISOString(),
      },
    })
  }

  private async getEventTypeForService(serviceType: string): Promise<number> {
    // Map service types to Cal.com event type IDs
    // This should be configured based on your Cal.com setup
    const serviceEventTypeMap: Record<string, number> = {
      "house-cleaning": 1,
      plumbing: 2,
      electrical: 3,
      handyman: 4,
      painting: 5,
      "pressure-washing": 6,
      "gutter-services": 7,
      "junk-removal": 8,
      welding: 9,
    }

    const eventTypeId = serviceEventTypeMap[serviceType]
    if (!eventTypeId) {
      throw new Error(`No event type configured for service: ${serviceType}`)
    }

    return eventTypeId
  }
}

export const calComService = new CalComService()
export default calComService
