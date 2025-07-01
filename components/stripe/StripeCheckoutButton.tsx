"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface LineItem {
  price_data: {
    currency: string
    product_data: {
      name: string
      description?: string
      images?: string[]
    }
    unit_amount: number
  }
  quantity: number
}

interface StripeCheckoutButtonProps {
  lineItems: LineItem[]
  metadata?: Record<string, string>
  onSuccess?: () => void
  onCancel?: () => void
}

export default function StripeCheckoutButton({ 
  lineItems, 
  metadata,
  onSuccess,
  onCancel 
}: StripeCheckoutButtonProps) {
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lineItems, metadata }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const { url } = await response.json()
      
      if (url) {
        router.push(url)
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    }
  }

  return (
    <Button onClick={handleCheckout} className="bg-green-600 hover:bg-green-700">
      Proceed to Payment
    </Button>
  )
}