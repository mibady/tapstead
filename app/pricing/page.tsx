import { MarketingLayout } from "@/components/layout/marketing-layout"
import { PricingOverview } from "@/components/pages/pricing-overview"

export const metadata = {
  title: "Transparent Pricing | Tapstead Home Services",
  description:
    "See our upfront pricing for all home services. No hidden fees, no surprises. Compare service plans and save with subscriptions.",
}

export default function PricingPage() {
  return (
    <MarketingLayout>
      <PricingOverview />
    </MarketingLayout>
  )
}
