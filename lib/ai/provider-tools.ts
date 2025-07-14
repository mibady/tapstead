import { tool } from "ai"
import { z } from "zod"
import { providerMatchingService } from "@/lib/services/provider-matching"

export const findProvidersSchema = z.object({
  serviceType: z.string().describe("Type of service needed (e.g., plumbing, electrical, cleaning)"),
  location: z.object({
    latitude: z.number().describe("Customer latitude"),
    longitude: z.number().describe("Customer longitude"),
    radius: z.number().optional().describe("Search radius in miles (default: 25)"),
  }),
  scheduledDate: z.string().describe("Preferred date in YYYY-MM-DD format"),
  scheduledTime: z.string().optional().describe("Preferred time in HH:MM format (24-hour)"),
  urgency: z.enum(["standard", "urgent", "emergency"]).optional().describe("Service urgency level"),
  customerPreferences: z
    .object({
      militaryVeteran: z.boolean().optional().describe("Prefer military veteran providers"),
      minRating: z.number().optional().describe("Minimum provider rating (1-5)"),
      maxDistance: z.number().optional().describe("Maximum distance in miles"),
      priceRange: z
        .object({
          min: z.number(),
          max: z.number(),
        })
        .optional()
        .describe("Acceptable price range"),
    })
    .optional(),
})

export const checkProviderAvailabilitySchema = z.object({
  providerId: z.string().describe("Provider ID to check availability for"),
  startDate: z.string().describe("Start date in ISO format"),
  endDate: z.string().describe("End date in ISO format"),
})

export const bookWithProviderSchema = z.object({
  providerId: z.string().describe("Provider ID to book with"),
  serviceType: z.string().describe("Type of service being booked"),
  scheduledDate: z.string().describe("Service date in YYYY-MM-DD format"),
  scheduledTime: z.string().describe("Service time in HH:MM format"),
  customerName: z.string().describe("Customer full name"),
  customerEmail: z.string().email().describe("Customer email address"),
  customerPhone: z.string().describe("Customer phone number"),
  address: z.string().describe("Service address"),
  description: z.string().optional().describe("Additional service details"),
  urgency: z.enum(["standard", "urgent", "emergency"]).optional().describe("Service urgency"),
})

export const getProviderScheduleSchema = z.object({
  providerId: z.string().describe("Provider ID to get schedule for"),
  date: z.string().describe("Date to check schedule for (YYYY-MM-DD)"),
})

export const providerTools = {
  findProviders: tool({
    description: "Find available service providers based on location, service type, and preferences",
    parameters: findProvidersSchema,
    execute: async (params) => {
      try {
        const providers = await providerMatchingService.findMatchingProviders(params)

        return {
          success: true,
          providers: providers.map((provider) => ({
            id: provider.id,
            name: provider.name,
            rating: provider.rating,
            reviewCount: provider.reviewCount,
            distance: provider.distance,
            estimatedArrival: provider.estimatedArrival,
            militaryVeteran: provider.militaryVeteran,
            services: provider.services,
            pricing: provider.pricing,
            availability: provider.availability,
            businessName: provider.businessName,
            yearsExperience: provider.yearsExperience,
            specialties: provider.specialties,
          })),
          totalFound: providers.length,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
          providers: [],
          totalFound: 0,
        }
      }
    },
  }),

  checkProviderAvailability: tool({
    description: "Check real-time availability for a specific provider",
    parameters: checkProviderAvailabilitySchema,
    execute: async (params) => {
      try {
        const availability = await providerMatchingService.getProviderAvailability(
          params.providerId,
          params.startDate,
          params.endDate,
        )

        return {
          success: true,
          providerId: params.providerId,
          availability,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
          providerId: params.providerId,
          availability: {
            isAvailable: false,
            availableSlots: [],
          },
        }
      }
    },
  }),

  bookWithProvider: tool({
    description: "Book a service appointment with a specific provider",
    parameters: bookWithProviderSchema,
    execute: async (params) => {
      try {
        const booking = await providerMatchingService.bookWithProvider(params.providerId, params)

        return {
          success: true,
          bookingId: booking.bookingId,
          calComBookingUid: booking.calComBookingUid,
          message: "Booking created successfully",
          scheduledDateTime: `${params.scheduledDate}T${params.scheduledTime}`,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
          bookingId: null,
          calComBookingUid: null,
        }
      }
    },
  }),

  getProviderSchedule: tool({
    description: "Get a provider's schedule for a specific date",
    parameters: getProviderScheduleSchema,
    execute: async (params) => {
      try {
        const startOfDay = new Date(params.date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(params.date)
        endOfDay.setHours(23, 59, 59, 999)

        const availability = await providerMatchingService.getProviderAvailability(
          params.providerId,
          startOfDay.toISOString(),
          endOfDay.toISOString(),
        )

        return {
          success: true,
          providerId: params.providerId,
          date: params.date,
          schedule: availability.availableSlots,
          isAvailable: availability.isAvailable,
          nextAvailableSlot: availability.nextAvailableSlot,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
          providerId: params.providerId,
          date: params.date,
          schedule: [],
          isAvailable: false,
        }
      }
    },
  }),
}

export default providerTools
