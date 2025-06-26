import { MarketingLayout } from "@/components/layout/marketing-layout"
import { SupportPage } from "@/components/pages/support"

export const metadata = {
  title: "Help & Support - Tapstead",
  description: "Get help with your Tapstead account, bookings, and services. Find answers to common questions.",
}

export default function Support() {
  return (
    <MarketingLayout>
      <SupportPage />
    </MarketingLayout>
  )
}
