import { MarketingLayout } from "@/components/layout/marketing-layout"
import { TermsPage } from "@/components/pages/terms"

export const metadata = {
  title: "Terms of Service | Tapstead",
  description: "Read Tapstead's terms of service and user agreement for our home services platform.",
}

export default function Terms() {
  return (
    <MarketingLayout>
      <TermsPage />
    </MarketingLayout>
  )
}
