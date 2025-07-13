import { MarketingLayout } from "@/components/layout/marketing-layout"
import { ServicesOverview } from "@/components/pages/services-overview"

export const metadata = {
  title: "All Home Services | Professional Service Providers | Tapstead",
  description:
    "Browse all professional home services available through Tapstead. From cleaning to repairs, find trusted service providers with transparent pricing and instant booking.",
  keywords: "home services, professional services, service providers, home maintenance, home repair",
}

export default function ServicesPage() {
  return (
    <MarketingLayout>
      <ServicesOverview />
    </MarketingLayout>
  )
}
