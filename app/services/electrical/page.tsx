import { MarketingLayout } from "@/components/layout/marketing-layout"
import { ElectricalService } from "@/components/pages/services/electrical-service"

export const metadata = {
  title: "Professional Electrical Services | Licensed Electricians | Tapstead",
  description:
    "Book licensed electricians for electrical repairs, installations, and upgrades. Safe, reliable electrical services with upfront pricing and guaranteed work.",
  keywords: "electrical services, electrician, electrical repair, electrical installation, licensed electrician",
}

export default function ElectricalServicePage() {
  return (
    <MarketingLayout>
      <ElectricalService />
    </MarketingLayout>
  )
}
