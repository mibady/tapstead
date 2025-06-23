import type { Metadata } from "next"
import { ServiceDetail } from "@/components/pages/services/service-detail"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { getServiceBySlug } from "@/lib/services/service-data"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Professional Electrical Services | Licensed Electricians | Tapstead",
  description:
    "Expert electrical services including repairs, installations, and upgrades. Licensed electricians available 24/7 for emergencies. Safe, reliable, and code-compliant work.",
  keywords:
    "electrical services, electrician, electrical repair, wiring, outlets, lighting installation, electrical emergency",
}

export default async function ElectricalServicePage() {
  const service = await getServiceBySlug("electrical")
  
  if (!service) {
    notFound()
  }
  
  return (
    <MarketingLayout>
      <ServiceDetail service={service} />
    </MarketingLayout>
  )
}
