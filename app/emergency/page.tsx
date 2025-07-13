import { MarketingLayout } from "@/components/layout/marketing-layout"
import { EmergencyServicesPage } from "@/components/pages/emergency-services"

export const metadata = {
  title: "24/7 Emergency Home Services | Tapstead",
  description:
    "24/7 emergency home services for urgent repairs, disasters, and critical situations. Fast response, professional service, available when you need us most.",
  keywords: "emergency services, 24/7 repair, emergency plumbing, emergency electrical, disaster cleanup",
}

export default function EmergencyPage() {
  return (
    <MarketingLayout>
      <EmergencyServicesPage />
    </MarketingLayout>
  )
}
