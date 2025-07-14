import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { calculatePricing, validatePricingInput } from "@/lib/pricing/calculator"
import { checkRateLimit } from "@/lib/cache/redis"
import { trackEvent } from "@/lib/monitoring/performance"

const bookingSchema = z.object({
  serviceType: z.literal("house-cleaning"),
  size: z.enum(["small", "medium", "large"]),
  frequency: z.enum(["one-time", "weekly", "biweekly", "monthly"]),
  addons: z.object({
    deepClean: z.boolean(),
    moveInOut: z.boolean(),
  }),
  scheduledDate: z.string().datetime(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(2).max(2),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  }),
  customerInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[\d\s\-$$$$]+$/),
  }),
  paymentMethodId: z.string().min(1),
  isWeekend: z.boolean().optional(),
  isSameDay: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Rate limiting
    const ip = request.ip || "unknown"
    const rateLimit = await checkRateLimit(ip, "bookings", 5) // 5 requests per hour

    if (!rateLimit.allowed) {
      await trackEvent("booking_rate_limited", { ip })
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        },
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Validate pricing input
    if (!validatePricingInput(validatedData)) {
      await trackEvent("booking_validation_failed", { reason: "invalid_pricing_input" })
      return NextResponse.json({ error: "Invalid pricing parameters" }, { status: 400 })
    }

    // Calculate pricing
    const pricing = await calculatePricing({
      size: validatedData.size,
      frequency: validatedData.frequency,
      addons: validatedData.addons,
      isWeekend: validatedData.isWeekend,
      isSameDay: validatedData.isSameDay,
    })

    // Get Supabase client
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      await trackEvent("booking_auth_failed", { error: authError?.message })
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        service_type: validatedData.serviceType,
        size: validatedData.size,
        frequency: validatedData.frequency,
        addons: validatedData.addons,
        scheduled_date: validatedData.scheduledDate,
        address: validatedData.address,
        customer_info: validatedData.customerInfo,
        pricing: {
          basePrice: pricing.basePrice,
          subscriptionDiscount: pricing.subscriptionDiscount,
          addonPrice: pricing.addonPrice,
          weekendSurcharge: pricing.weekendSurcharge,
          sameDayFee: pricing.sameDayFee,
          subtotal: pricing.subtotal,
          total: pricing.total,
        },
        total_amount: pricing.total,
        stripe_product_id: pricing.stripeProductId,
        stripe_price_id: pricing.stripePriceId,
        payment_method_id: validatedData.paymentMethodId,
        status: "pending_payment",
      })
      .select()
      .single()

    if (bookingError) {
      await trackEvent("booking_creation_failed", {
        error: bookingError.message,
        user_id: user.id,
      })
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    // Track successful booking creation
    const duration = Date.now() - startTime
    await trackEvent("booking_created", {
      booking_id: booking.id,
      user_id: user.id,
      service_type: validatedData.serviceType,
      total_amount: pricing.total,
      duration_ms: duration,
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        total: pricing.total,
        stripeProductId: pricing.stripeProductId,
        stripePriceId: pricing.stripePriceId,
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime

    if (error instanceof z.ZodError) {
      await trackEvent("booking_validation_failed", {
        errors: error.errors,
        duration_ms: duration,
      })
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    await trackEvent("booking_error", {
      error: error instanceof Error ? error.message : "Unknown error",
      duration_ms: duration,
    })

    console.error("Booking API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get user's bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (bookingsError) {
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
