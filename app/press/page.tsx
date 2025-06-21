import { MarketingLayout } from "@/components/layout/marketing-layout"
import { PressPage } from "@/components/pages/press"

export const metadata = {
  title: "Press & Media - Tapstead News",
  description:
    "Latest news, press releases, and media coverage about Tapstead's mission to revolutionize home services.",
}

export default function Press() {
  return (
    <MarketingLayout>
      <PressPage />
    </MarketingLayout>
  )
}
