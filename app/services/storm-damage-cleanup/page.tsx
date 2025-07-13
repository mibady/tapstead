import { MarketingLayout } from "@/components/layout/marketing-layout"
import { StormDamageCleanupService } from "@/components/pages/services/storm-damage-cleanup-service"

export const metadata = {
  title: "Storm Damage Cleanup Services | Emergency Storm Recovery | Tapstead",
  description:
    "Professional storm damage cleanup and recovery services. 24/7 emergency response for wind, hail, and water damage restoration by certified specialists.",
  keywords: "storm damage cleanup, storm recovery, wind damage, hail damage, emergency cleanup, storm restoration",
}

export default function StormDamageCleanupPage() {
  return (
    <MarketingLayout>
      <StormDamageCleanupService />
    </MarketingLayout>
  )
}
