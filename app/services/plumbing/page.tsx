import { MarketingLayout } from "@/components/layout/marketing-layout"
import { PlumbingService } from "@/components/pages/services/plumbing-service"

export const metadata = {
  title: "Professional Plumbing Services | Licensed Plumbers | Tapstead",
  description:
    "Book licensed plumbers for repairs, installations, and emergency plumbing services. Fast response, upfront pricing, and guaranteed work from trusted professionals.",
  keywords: "plumbing services, plumber, plumbing repair, emergency plumbing, licensed plumber, pipe repair",
}

export default function PlumbingServicePage() {
  return (
    <MarketingLayout>
      <PlumbingService />
    </MarketingLayout>
  )
}
