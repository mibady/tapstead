import { MarketingLayout } from "@/components/layout/marketing-layout"
import { CareersPage } from "@/components/pages/careers"
import { RecruitingAgent } from "@/components/agents/RecruitingAgent"

export const metadata = {
  title: "Careers - Join the Tapstead Team",
  description:
    "Join Tapstead and help revolutionize home services. Explore career opportunities in tech, operations, and service delivery.",
}

export default function Careers() {
  return (
    <MarketingLayout>
      <CareersPage />
      <RecruitingAgent />
    </MarketingLayout>
  )
}
