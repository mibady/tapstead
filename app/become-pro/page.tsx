import { MarketingLayout } from "@/components/layout/marketing-layout"
import { ProRecruitmentLanding } from "@/components/provider/pro-recruitment-landing"

export const metadata = {
  title: "Become a Tapstead Pro | Join Our Network",
  description:
    "Join the Tapstead professional network. Grow your business, get more customers, and be part of the future of home services.",
  keywords: "become a pro, service provider, contractor network, grow business, home service professional",
}

export default function BecomeProPage() {
  return (
    <MarketingLayout>
      <ProRecruitmentLanding />
    </MarketingLayout>
  )
}
