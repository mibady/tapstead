import { MarketingLayout } from "@/components/layout/marketing-layout"
import { StormDamageCleanupService } from "@/components/pages/services/storm-damage-cleanup-service"

export const metadata = {
  title: "Storm Damage Cleanup Services | Emergency Response | Tapstead",
  description:
    "24/7 storm damage cleanup and debris removal. Professional emergency response team ready to restore your property after severe weather.",
}

export default function StormDamageCleanupPage() {
  return (
    <MarketingLayout>
      <StormDamageCleanupService />
    </MarketingLayout>
  )
}
