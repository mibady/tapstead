import { MarketingLayout } from "@/components/layout/marketing-layout"
import { FireDebrisRemovalService } from "@/components/pages/services/fire-debris-removal-service"

export const metadata = {
  title: "Fire Debris Removal Services | Emergency Cleanup | Tapstead",
  description:
    "Professional fire debris removal and cleanup services. 24/7 emergency response for fire damage restoration and debris removal by certified specialists.",
  keywords:
    "fire debris removal, fire cleanup, fire damage restoration, emergency cleanup, fire debris, disaster cleanup",
}

export default function FireDebrisRemovalServicePage() {
  return (
    <MarketingLayout>
      <FireDebrisRemovalService />
    </MarketingLayout>
  )
}
