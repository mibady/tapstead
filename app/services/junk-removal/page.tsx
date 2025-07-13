import { MarketingLayout } from "@/components/layout/marketing-layout"
import { JunkRemovalService } from "@/components/pages/services/junk-removal-service"

export const metadata = {
  title: "Professional Junk Removal Services | Tapstead",
  description:
    "Book professional junk removal for furniture, appliances, construction debris, and estate cleanouts. Same-day service, eco-friendly disposal, no hidden fees.",
  keywords: "junk removal, furniture removal, appliance removal, construction debris, estate cleanout",
}

export default function JunkRemovalPage() {
  return (
    <MarketingLayout>
      <JunkRemovalService />
    </MarketingLayout>
  )
}
