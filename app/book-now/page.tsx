import { BookingFlow } from "@/components/booking/booking-flow"
// Header is now included in ClientLayoutWrapper
import { Footer } from "@/components/layout/footer"

export default function BookNowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <BookingFlow />
      </main>
      <Footer />
    </div>
  )
}
