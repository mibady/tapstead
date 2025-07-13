import { MarketingLayout } from "@/components/layout/marketing-layout"
import { PressureWashingService } from "@/components/pages/services/pressure-washing-service"

export const metadata = {
  title: "Professional Pressure Washing Services | Tapstead",
  description:
    "Book professional pressure washing for driveways, decks, siding, and exterior surfaces. Professional equipment, eco-safe detergents, before/after photos.",
  keywords: "pressure washing, power washing, driveway cleaning, deck cleaning, siding cleaning",
}

export default function PressureWashingPage() {
  return (
    <MarketingLayout>
      <PressureWashingService />
    </MarketingLayout>
  )
}
