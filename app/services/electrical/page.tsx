import type { Metadata } from "next"
import ElectricalService from "@/components/pages/services/electrical-service"
import { Header } from "@/components/layout/header"

export const metadata: Metadata = {
  title: "Professional Electrical Services | Licensed Electricians | Tapstead",
  description:
    "Expert electrical services including repairs, installations, and upgrades. Licensed electricians available 24/7 for emergencies. Safe, reliable, and code-compliant work.",
  keywords:
    "electrical services, electrician, electrical repair, wiring, outlets, lighting installation, electrical emergency",
}

export default function ElectricalServicePage() {
  return (
    <>
      <Header />
      <ElectricalService />
    </>
  )
}
