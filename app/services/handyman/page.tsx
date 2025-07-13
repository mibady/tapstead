import { MarketingLayout } from "@/components/layout/marketing-layout"
import { HandymanService } from "@/components/pages/services/handyman-service"

export const metadata = {
  title: "Professional Handyman Services | Home Repairs & Maintenance | Tapstead",
  description:
    "Book skilled handymen for home repairs, maintenance, and small projects. From fixing leaks to mounting TVs, get reliable handyman services with upfront pricing.",
  keywords: "handyman services, home repair, maintenance, handyman, home improvement, small repairs",
}

export default function HandymanServicePage() {
  return (
    <MarketingLayout>
      <HandymanService />
    </MarketingLayout>
  )
}
