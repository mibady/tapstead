import { MarketingLayout } from "@/components/layout/marketing-layout"
import { HouseCleaningService } from "@/components/pages/services/house-cleaning-service"

export const metadata = {
  title: "Professional House Cleaning Services | Residential Cleaning | Tapstead",
  description:
    "Book professional house cleaning services. Regular cleaning, deep cleaning, and move-in/out cleaning by trusted, insured cleaners with eco-friendly products.",
  keywords:
    "house cleaning, residential cleaning, maid service, deep cleaning, regular cleaning, eco-friendly cleaning",
}

export default function HouseCleaningServicePage() {
  return (
    <MarketingLayout>
      <HouseCleaningService />
    </MarketingLayout>
  )
}
