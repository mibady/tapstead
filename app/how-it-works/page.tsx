import { MarketingLayout } from "@/components/layout/marketing-layout"
import { HowItWorksDetailed } from "@/components/pages/how-it-works-detailed"

export const metadata = {
  title: "How Tapstead Works | Simple 3-Step Process",
  description:
    "Learn how easy it is to book professional home services with Tapstead. Book in 60 seconds, we handle everything, job done right.",
}

export default function HowItWorksPage() {
  return (
    <MarketingLayout>
      <HowItWorksDetailed />
    </MarketingLayout>
  )
}
