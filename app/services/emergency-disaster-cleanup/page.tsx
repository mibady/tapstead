import { MarketingLayout } from "@/components/layout/marketing-layout"
import { EmergencyDisasterCleanupService } from "@/components/pages/services/emergency-disaster-cleanup-service"

export const metadata = {
  title: "Emergency Disaster Cleanup Services | 24/7 Response | Tapstead",
  description:
    "Professional emergency disaster cleanup services. 24/7 response for natural disasters, floods, fires, and severe weather damage by certified specialists.",
  keywords:
    "emergency cleanup, disaster cleanup, flood cleanup, natural disaster, emergency response, disaster restoration",
}

export default function EmergencyDisasterCleanupPage() {
  return (
    <MarketingLayout>
      <EmergencyDisasterCleanupService />
    </MarketingLayout>
  )
}
