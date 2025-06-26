import type { Metadata } from "next"
import { ServiceDetail } from "@/components/pages/services/service-detail"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { getServiceBySlug } from "@/lib/services/service-data"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  
  if (!service) {
    return {
      title: "Service Not Found | Tapstead",
      description: "The requested service could not be found."
    }
  }
  
  const isEmergency = service.category.toLowerCase().includes('emergency')
  
  return {
    title: `${service.title} | Professional Home Services | Tapstead`,
    description: service.description,
    keywords: `${service.title.toLowerCase()}, home services, professional ${service.category.toLowerCase()}, tapstead`
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  
  if (!service) {
    notFound()
  }
  
  const isEmergency = service.category.toLowerCase().includes('emergency')
  
  return (
    <MarketingLayout>
      <ServiceDetail service={service} isEmergency={isEmergency} />
    </MarketingLayout>
  )
}
