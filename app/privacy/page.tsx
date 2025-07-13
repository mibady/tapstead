import { MarketingLayout } from "@/components/layout/marketing-layout"
import { PrivacyPage } from "@/components/pages/privacy"

export const metadata = {
  title: "Privacy Policy | Tapstead",
  description: "Learn how Tapstead protects your privacy and handles your personal information.",
}

export default function Privacy() {
  return (
    <MarketingLayout>
      <PrivacyPage />
    </MarketingLayout>
  )
}
