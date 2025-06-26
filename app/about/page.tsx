import { MarketingLayout } from "@/components/layout/marketing-layout"
import { AboutUs } from "@/components/pages/about-us"

export const metadata = {
  title: "About Tapstead | Our Mission & Story",
  description:
    "Learn about Tapstead's mission to simplify home services. Meet our team, discover our values, and see how we're revolutionizing home maintenance.",
}

export default function AboutPage() {
  return (
    <MarketingLayout>
      <AboutUs />
    </MarketingLayout>
  )
}
