import { MarketingLayout } from "@/components/layout/marketing-layout"
import { ServicesOverview } from "@/components/pages/services-overview"

export const metadata = {
  title: "Professional Home Services | Tapstead",
  description:
    "Browse all our professional home services including cleaning, handyman, plumbing, electrical, and emergency services. Transparent pricing, trusted pros.",
}

export default async function ServicesPage() {
  return (
    <MarketingLayout>
      {await ServicesOverview()}
    </MarketingLayout>
  )
}
