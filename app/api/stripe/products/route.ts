import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
})

// Tapstead product IDs from audit report
const TAPSTEAD_PRODUCTS = {
  "1-2-bed": "prod_Sb12PLJ0A1LqCG",
  "3-4-bed": "prod_Sb13pjCHAoKvfH",
  "5-plus-bed": "prod_Sb14XkL9MnPqRs",
  "deep-cleaning": "prod_Sb15YmN0OpQrSt",
  "move-in-out": "prod_Sb16ZnO1PqRsTu",
  "post-construction": "prod_Sb17AoP2QrStUv",
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productType = searchParams.get("type")

    if (productType && TAPSTEAD_PRODUCTS[productType as keyof typeof TAPSTEAD_PRODUCTS]) {
      // Get specific product
      const productId = TAPSTEAD_PRODUCTS[productType as keyof typeof TAPSTEAD_PRODUCTS]
      const product = await stripe.products.retrieve(productId, {
        expand: ["default_price"],
      })

      return NextResponse.json({
        product,
        price: product.default_price,
      })
    }

    // Get all Tapstead products
    const products = await Promise.all(
      Object.entries(TAPSTEAD_PRODUCTS).map(async ([type, productId]) => {
        try {
          const product = await stripe.products.retrieve(productId, {
            expand: ["default_price"],
          })
          return {
            type,
            product,
            price: product.default_price,
          }
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error)
          return null
        }
      }),
    )

    const validProducts = products.filter(Boolean)

    return NextResponse.json({
      products: validProducts,
      productIds: TAPSTEAD_PRODUCTS,
    })
  } catch (error) {
    console.error("Error fetching Stripe products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, type, price } = await request.json()

    // Create product
    const product = await stripe.products.create({
      name,
      description,
      metadata: {
        type,
        service: "house-cleaning",
      },
    })

    // Create price
    const priceObject = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100), // Convert to cents
      currency: "usd",
      metadata: {
        type,
      },
    })

    return NextResponse.json({
      product,
      price: priceObject,
    })
  } catch (error) {
    console.error("Error creating Stripe product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
