import BookingFlow from "@/components/booking/BookingFlow"
// Header is now included in ClientLayoutWrapper
import { Footer } from "@/components/layout/footer"
import { BookingAgent } from "@/components/agents/BookingAgent"

interface SearchParams {
  service?: string;
  success?: string;
  canceled?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

export default function BookNowPage({ searchParams }: PageProps) {
  // Handle search params client-side to avoid server/client mismatch
  let serviceId: string | undefined;
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    serviceId = urlParams.get('service') || undefined;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <BookingFlow initialServiceId={serviceId} />
      </main>
      <Footer />
      <BookingAgent />
    </div>
  )
}
