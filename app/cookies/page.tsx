import { MarketingLayout } from "@/components/layout/marketing-layout"
import { CookiesPage } from "@/components/pages/cookies"

export const metadata = {
  title: "Cookie Policy - Tapstead",
  description: "Learn about how Tapstead uses cookies and similar technologies on our platform.",
}

export default function Cookies() {
  return (
    <MarketingLayout>
      <CookiesPage />
    </MarketingLayout>
  )
}
