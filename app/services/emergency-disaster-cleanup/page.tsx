import { MarketingLayout } from "@/components/layout/marketing-layout"
import { EmergencyDisasterCleanupService } from "@/components/pages/services/emergency-disaster-cleanup-service"

export const metadata = {
  title: "Emergency Disaster Cleanup | 24/7 Response | Tapstead",
  description:
    "Professional emergency disaster cleanup services. Available 24/7 for flood, fire, storm, and other disaster recovery needs.",
}

export default function EmergencyDisasterCleanupPage() {
  return (
    <MarketingLayout>
      <EmergencyDisasterCleanupService />
    </MarketingLayout>
  )
}
