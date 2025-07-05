export interface AvailabilityResponse {
  busy: Array<{
    start: string;
    end: string;
  }>;
  timeSlots: Array<{
    start: string;
    end: string;
  }>;
}

export async function getAvailability(date: Date): Promise<AvailabilityResponse> {
  try {
    const response = await fetch('/api/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch availability')
    }

    const data = await response.json()
    return {
      busy: data.busy || [],
      timeSlots: generateTimeSlots(date, data.busy || [])
    }
  } catch (error) {
    console.error('Error fetching availability:', error)
    return { busy: [], timeSlots: [] }
  }
}

export async function createBooking(bookingData: {
  name: string;
  email: string;
  startTime: string;
  endTime: string;
  notes?: string;
}) {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      throw new Error('Failed to create booking')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

// Helper function to generate available time slots
function generateTimeSlots(
  date: Date,
  busySlots: Array<{ start: string; end: string }>,
): Array<{ start: string; end: string }> {
  const timeSlots: Array<{ start: string; end: string }> = []
  const currentTime = new Date()
  
  // Business hours: 8 AM to 6 PM
  const startHour = 8
  const endHour = 18
  
  // Slot duration in minutes
  const duration = 60

  for (let hour = startHour; hour < endHour; hour++) {
    const slotStart = new Date(date)
    slotStart.setHours(hour, 0, 0, 0)

    const slotEnd = new Date(slotStart)
    slotEnd.setMinutes(slotStart.getMinutes() + duration)

    // Skip if slot is in the past
    if (slotStart < currentTime) continue

    // Check if slot overlaps with any busy periods
    const isAvailable = !busySlots.some(busy => {
      const busyStart = new Date(busy.start)
      const busyEnd = new Date(busy.end)
      return (
        (slotStart >= busyStart && slotStart < busyEnd) ||
        (slotEnd > busyStart && slotEnd <= busyEnd)
      )
    })

    if (isAvailable) {
      timeSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      })
    }
  }

  return timeSlots
}