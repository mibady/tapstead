'use client'

import { QuoteRequestFlow } from "@/components/booking/quote-request-flow"
import { Footer } from "@/components/layout/footer"

export default function RequestQuotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <QuoteRequestFlow />
      </main>
      <Footer />
    </div>
  )
}