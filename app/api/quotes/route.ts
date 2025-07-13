import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const QuoteAnalysisSchema = z.object({
  complexity: z.enum(["low", "medium", "high"]),
  estimatedHours: z.number(),
  suggestedPrice: z.number(),
  specialRequirements: z.array(z.string()),
  riskFactors: z.array(z.string()),
  recommendedServices: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceType,
      propertyType,
      bedrooms,
      bathrooms,
      squareFootage,
      specialRequests,
      preferredDate,
      urgency,
      address,
    } = body

    // AI Analysis of the quote request
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: QuoteAnalysisSchema,
      prompt: `Analyze this house cleaning quote request:
        - Service: ${serviceType}
        - Property: ${propertyType}, ${bedrooms} bed, ${bathrooms} bath, ${squareFootage} sq ft
        - Special requests: ${specialRequests || "None"}
        - Urgency: ${urgency}
        
        Provide complexity assessment, time estimate, pricing suggestion, and recommendations.
        Base pricing on Pacific Northwest market rates for professional cleaning services.`,
    })

    // Insert quote request into database
    const { data: quote, error: quoteError } = await supabase
      .from("quote_requests")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        service_type: serviceType,
        property_type: propertyType,
        bedrooms: Number.parseInt(bedrooms),
        bathrooms: Number.parseInt(bathrooms),
        square_footage: Number.parseInt(squareFootage),
        special_requests: specialRequests,
        preferred_date: preferredDate,
        urgency,
        address,
        status: "pending",
        ai_analysis: analysis,
        estimated_price: analysis.suggestedPrice,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (quoteError) {
      console.error("Database error:", quoteError)
      return NextResponse.json({ error: "Failed to save quote request" }, { status: 500 })
    }

    // Send notification email (if Resend is configured)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/quote-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quote.id,
          customerName,
          customerEmail,
          serviceType,
          analysis,
        }),
      })
    } catch (emailError) {
      console.warn("Email notification failed:", emailError)
      // Don't fail the quote creation if email fails
    }

    return NextResponse.json({
      success: true,
      quote,
      analysis,
      message: "Quote request submitted successfully",
    })
  } catch (error) {
    console.error("Error processing quote request:", error)
    return NextResponse.json({ error: "Failed to process quote request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: quotes, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
    }

    return NextResponse.json({
      quotes,
      pagination: {
        limit,
        offset,
        total: quotes?.length || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
  }
}
