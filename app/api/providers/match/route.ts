import { type NextRequest, NextResponse } from "next/server"
import { providerMatchingService } from "@/lib/services/provider-matching"
import { z } from "zod"

const matchProvidersSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radius: z.number().min(1).max(100).optional(),
  }),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  scheduledTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format")
    .optional(),
  urgency: z.enum(["standard", "urgent", "emergency"]).optional(),
  customerPreferences: z
    .object({
      militaryVeteran: z.boolean().optional(),
      minRating: z.number().min(1).max(5).optional(),
      maxDistance: z.number().min(1).max(100).optional(),
      priceRange: z
        .object({
          min: z.number().min(0),
          max: z.number().min(0),
        })
        .optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = matchProvidersSchema.parse(body)

    // Find matching providers
    const providers = await providerMatchingService.findMatchingProviders(validatedData)

    return NextResponse.json({
      success: true,
      providers,
      totalFound: providers.length,
      searchCriteria: validatedData,
    })
  } catch (error) {
    console.error("Provider matching error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const providerId = searchParams.get("providerId")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (!providerId) {
    return NextResponse.json({ success: false, error: "Provider ID is required" }, { status: 400 })
  }

  try {
    const start = startDate || new Date().toISOString()
    const end = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const availability = await providerMatchingService.getProviderAvailability(providerId, start, end)

    return NextResponse.json({
      success: true,
      providerId,
      availability,
    })
  } catch (error) {
    console.error("Provider availability error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
