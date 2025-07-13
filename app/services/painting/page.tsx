import { MarketingLayout } from "@/components/layout/marketing-layout"
import { PaintingService } from "@/components/pages/services/painting-service"

export const metadata = {
  title: "Professional Painting Services | Interior & Exterior | Tapstead",
  description:
    "Expert painting services for interior and exterior projects. Professional painters using premium paints and techniques for beautiful, lasting results.",
  keywords: "painting services, interior painting, exterior painting, house painting, professional painters, paint job",
}

export default function PaintingServicePage() {
  return (
    <MarketingLayout>
      <PaintingService />
    </MarketingLayout>
  )
}
