import { createClient } from "@/lib/supabase/server"
import { calComService } from "@/lib/integrations/cal-com"

interface Location {
  latitude: number
  longitude: number
  radius?: number
}

interface MatchingCriteria {
  serviceType: string
  location: Location
  scheduledDate: string
  scheduledTime?: string
  urgency?: "standard" | "urgent" | "emergency"
  customerPreferences?: {
    militaryVeteran?: boolean
    minRating?: number
    maxDistance?: number
    priceRange?: { min: number; max: number }
  }
}

interface ProviderMatch {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance: number
  estimatedArrival: string
  militaryVeteran: boolean
  services: string[]
  pricing: {
    baseRate: number
    urgencyMultiplier: number
    travelFee: number
    totalEstimate: number
  }
  availability: {
    isAvailable: boolean
    nextAvailableSlot?: string
    availableSlots: Array<{ start: string; end: string }>
  }
  calComEventTypeId: number
  profileImage?: string
  businessName?: string
  yearsExperience?: number
  specialties?: string[]
  contact: {
    phone: string
    email: string
  }
}

class ProviderMatchingService {
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959 // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private calculatePricing(baseRate: number, urgency: string, distance: number): ProviderMatch["pricing"] {
    const urgencyMultipliers = {
      standard: 1.0,
      urgent: 1.25,
      emergency: 1.5,
    }

    const urgencyMultiplier = urgencyMultipliers[urgency as keyof typeof urgencyMultipliers] || 1.0
    const travelFee = distance > 15 ? (distance - 15) * 3 : 0

    return {
      baseRate,
      urgencyMultiplier,
      travelFee,
      totalEstimate: Math.round(baseRate * urgencyMultiplier + travelFee),
    }
  }

  private calculateEstimatedArrival(distance: number, urgency: string): string {
    const baseSpeed = 30 // mph average in city
    const urgencyMultipliers = {
      standard: 1.0,
      urgent: 1.2,
      emergency: 1.5,
    }

    const speed = baseSpeed * (urgencyMultipliers[urgency as keyof typeof urgencyMultipliers] || 1.0)
    const travelTimeHours = distance / speed
    const travelTimeMinutes = Math.round(travelTimeHours * 60)

    const now = new Date()
    const arrivalTime = new Date(now.getTime() + travelTimeMinutes * 60000)

    return arrivalTime.toISOString()
  }

  async findMatchingProviders(criteria: MatchingCriteria): Promise<ProviderMatch[]> {
    const supabase = await createClient()

    // Step 1: Find providers who offer the service within radius
    const { data: providers, error } = await supabase
      .from("providers")
      .select(`
        *,
        users!inner(
          id,
          first_name,
          last_name,
          email,
          phone,
          profile_image_url
        )
      `)
      .contains("services", [criteria.serviceType])
      .eq("active", true)
      .gte("rating", criteria.customerPreferences?.minRating || 3.0)

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    if (!providers || providers.length === 0) {
      return []
    }

    // Step 2: Calculate distances and filter by radius
    const providersWithDistance = providers
      .map((provider) => ({
        ...provider,
        distance: this.calculateDistance(
          criteria.location.latitude,
          criteria.location.longitude,
          provider.latitude,
          provider.longitude,
        ),
      }))
      .filter((provider) => {
        const maxDistance = Math.min(
          criteria.location.radius || 50,
          provider.availability_radius || 25,
          criteria.customerPreferences?.maxDistance || 50,
        )
        return provider.distance <= maxDistance
      })

    // Step 3: Check real-time availability for each provider
    const providerMatches: ProviderMatch[] = []

    for (const provider of providersWithDistance) {
      try {
        // Get available slots for the requested date
        const startOfDay = new Date(criteria.scheduledDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(criteria.scheduledDate)
        endOfDay.setHours(23, 59, 59, 999)

        const availableSlots = await calComService.getAvailableSlots({
          eventTypeId: provider.cal_com_event_type_id,
          startTime: startOfDay.toISOString(),
          endTime: endOfDay.toISOString(),
          timeZone: "America/New_York",
        })

        // Check if provider is available at requested time
        let isAvailable = true
        let nextAvailableSlot: string | undefined

        if (criteria.scheduledTime) {
          const requestedDateTime = new Date(`${criteria.scheduledDate}T${criteria.scheduledTime}`)
          isAvailable = availableSlots.some((slot) => {
            const slotStart = new Date(slot.time)
            const slotEnd = new Date(slotStart.getTime() + 2 * 60 * 60 * 1000) // Assume 2-hour slots
            return requestedDateTime >= slotStart && requestedDateTime < slotEnd
          })
        }

        if (!isAvailable && availableSlots.length > 0) {
          nextAvailableSlot = availableSlots[0].time
        }

        // Skip providers with no availability if specific time requested
        if (criteria.scheduledTime && !isAvailable && !nextAvailableSlot) {
          continue
        }

        const pricing = this.calculatePricing(
          provider.base_rate || 75,
          criteria.urgency || "standard",
          provider.distance,
        )

        // Filter by price range if specified
        if (criteria.customerPreferences?.priceRange) {
          const { min, max } = criteria.customerPreferences.priceRange
          if (pricing.totalEstimate < min || pricing.totalEstimate > max) {
            continue
          }
        }

        const providerMatch: ProviderMatch = {
          id: provider.id,
          name: `${provider.users.first_name} ${provider.users.last_name}`,
          rating: provider.rating || 0,
          reviewCount: provider.review_count || 0,
          distance: Math.round(provider.distance * 10) / 10,
          estimatedArrival: this.calculateEstimatedArrival(provider.distance, criteria.urgency || "standard"),
          militaryVeteran: provider.military_veteran || false,
          services: provider.services || [],
          pricing,
          availability: {
            isAvailable,
            nextAvailableSlot,
            availableSlots: availableSlots.map((slot) => ({
              start: slot.time,
              end: new Date(new Date(slot.time).getTime() + 2 * 60 * 60 * 1000).toISOString(),
            })),
          },
          calComEventTypeId: provider.cal_com_event_type_id,
          profileImage: provider.users.profile_image_url,
          businessName: provider.business_name,
          yearsExperience: provider.years_experience,
          specialties: provider.specialties || [],
          contact: {
            phone: provider.users.phone,
            email: provider.users.email,
          },
        }

        providerMatches.push(providerMatch)
      } catch (error) {
        console.error(`Error checking availability for provider ${provider.id}:`, error)
        // Continue with other providers
      }
    }

    // Step 4: Sort providers by preference
    return this.sortProviders(providerMatches, criteria)
  }

  private sortProviders(providers: ProviderMatch[], criteria: MatchingCriteria): ProviderMatch[] {
    return providers.sort((a, b) => {
      // 1. Availability (available providers first)
      if (a.availability.isAvailable && !b.availability.isAvailable) return -1
      if (!a.availability.isAvailable && b.availability.isAvailable) return 1

      // 2. Military veteran preference (if customer prefers)
      if (criteria.customerPreferences?.militaryVeteran) {
        if (a.militaryVeteran && !b.militaryVeteran) return -1
        if (!a.militaryVeteran && b.militaryVeteran) return 1
      }

      // 3. Rating (higher is better)
      if (Math.abs(b.rating - a.rating) > 0.1) {
        return b.rating - a.rating
      }

      // 4. Distance (closer is better)
      return a.distance - b.distance
    })
  }

  async getProviderAvailability(
    providerId: string,
    startDate: string,
    endDate: string,
  ): Promise<ProviderMatch["availability"]> {
    const supabase = await createClient()

    const { data: provider, error } = await supabase
      .from("providers")
      .select("cal_com_event_type_id")
      .eq("id", providerId)
      .single()

    if (error || !provider) {
      throw new Error("Provider not found")
    }

    const availableSlots = await calComService.getAvailableSlots({
      eventTypeId: provider.cal_com_event_type_id,
      startTime: startDate,
      endTime: endDate,
      timeZone: "America/New_York",
    })

    return {
      isAvailable: availableSlots.length > 0,
      nextAvailableSlot: availableSlots.length > 0 ? availableSlots[0].time : undefined,
      availableSlots: availableSlots.map((slot) => ({
        start: slot.time,
        end: new Date(new Date(slot.time).getTime() + 2 * 60 * 60 * 1000).toISOString(),
      })),
    }
  }

  async bookWithProvider(
    providerId: string,
    bookingDetails: {
      serviceType: string
      scheduledDate: string
      scheduledTime: string
      customerName: string
      customerEmail: string
      customerPhone: string
      address: string
      description?: string
      urgency?: string
    },
  ): Promise<{ bookingId: string; calComBookingUid: string }> {
    const supabase = await createClient()

    // Get provider details
    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("cal_com_event_type_id, base_rate")
      .eq("id", providerId)
      .single()

    if (providerError || !provider) {
      throw new Error("Provider not found")
    }

    // Create local booking record first
    const { data: localBooking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        provider_id: providerId,
        service_type: bookingDetails.serviceType,
        scheduled_date: bookingDetails.scheduledDate,
        scheduled_time: bookingDetails.scheduledTime,
        customer_name: bookingDetails.customerName,
        customer_email: bookingDetails.customerEmail,
        customer_phone: bookingDetails.customerPhone,
        address: bookingDetails.address,
        description: bookingDetails.description,
        urgency: bookingDetails.urgency || "standard",
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (bookingError || !localBooking) {
      throw new Error("Failed to create booking record")
    }

    try {
      // Create Cal.com booking
      const startDateTime = new Date(`${bookingDetails.scheduledDate}T${bookingDetails.scheduledTime}`)
      const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000) // 2-hour service

      const calComBooking = await calComService.createBooking({
        eventTypeId: provider.cal_com_event_type_id,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        attendee: {
          name: bookingDetails.customerName,
          email: bookingDetails.customerEmail,
          timeZone: "America/New_York",
        },
        metadata: {
          tapstead_booking_id: localBooking.id,
          service_type: bookingDetails.serviceType,
          address: bookingDetails.address,
          phone: bookingDetails.customerPhone,
          urgency: bookingDetails.urgency,
        },
        bookingFieldsResponses: {
          address: bookingDetails.address,
          specialInstructions: bookingDetails.description,
          serviceType: bookingDetails.serviceType,
        },
      })

      // Update local booking with Cal.com details
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          cal_com_booking_id: calComBooking.id,
          cal_com_uid: calComBooking.uid,
          status: "confirmed",
        })
        .eq("id", localBooking.id)

      if (updateError) {
        // Try to cancel the Cal.com booking if local update fails
        await calComService.cancelBooking(calComBooking.uid, "Local booking update failed")
        throw new Error("Failed to update booking with Cal.com details")
      }

      return {
        bookingId: localBooking.id,
        calComBookingUid: calComBooking.uid,
      }
    } catch (error) {
      // Clean up local booking if Cal.com booking fails
      await supabase.from("bookings").delete().eq("id", localBooking.id)
      throw error
    }
  }
}

export const providerMatchingService = new ProviderMatchingService()
export default providerMatchingService
