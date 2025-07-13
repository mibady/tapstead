import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.Stripe_Secret_key!, {
  apiVersion: "2024-06-20",
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const frequency = searchParams.get("frequency")
    const houseSize = searchParams.get("houseSize")

    // Get base prices
    const basePrices = {
      small: 149,
      medium: 199,
      large: 299,
    }

    const discounts = {
      weekly: 0.33,
      biweekly: 0.27,
      monthly: 0.2,
    }

    const basePrice = basePrices[houseSize as keyof typeof basePrices] || 149
    const discount = discounts[frequency as keyof typeof discounts] || 0
    const finalPrice = Math.round(basePrice * (1 - discount))

    // Create or get Stripe price
    let priceId: string

    if (frequency === "one-time") {
      // For one-time payments, we don't need a Stripe price
      priceId = ""
    } else {
      // Create recurring price
      const intervalMap = {
        weekly: "week",
        biweekly: { interval: "week", interval_count: 2 },
        monthly: "month",
      }

      const interval = intervalMap[frequency as keyof typeof intervalMap]

      const price = await stripe.prices.create({
        unit_amount: finalPrice * 100, // Convert to cents
        currency: "usd",
        recurring:
          typeof interval === "string"
            ? { interval: interval as "week" | "month" }
            : { interval: "week", interval_count: 2 },
        product_data: {
          name: `House Cleaning - ${houseSize} (${frequency})`,
          description: `Professional house cleaning service for ${houseSize} homes, billed ${frequency}`,
        },
        metadata: {
          service_type: "house-cleaning",
          frequency,
          house_size: houseSize,
        },
      })

      priceId = price.id
    }

    return NextResponse.json({
      priceId,
      amount: finalPrice,
      basePrice,
      discount: Math.round(discount * 100),
    })
  } catch (error) {
    console.error("Error creating/getting price:", error)
    return NextResponse.json({ error: "Failed to get price information" }, { status: 500 })
  }
}
