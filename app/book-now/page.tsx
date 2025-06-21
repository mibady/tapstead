import { BookingFlow } from "@/components/booking/booking-flow"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function BookNowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <BookingFlow />
      </main>
      <Footer />
    </div>
  )
}
