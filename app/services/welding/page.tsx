import type { Metadata } from "next"
import WeldingService from "@/components/pages/services/welding-service"

export const metadata: Metadata = {
  title: "Professional Welding Services | Metal Fabrication & Repair | Tapstead",
  description:
    "Expert welding and metal fabrication services. Custom metalwork, repairs, and fabrication by certified welders using professional equipment.",
  keywords:
    "welding services, metal fabrication, welding repair, custom metalwork, certified welder, steel fabrication",
}

export default function WeldingServicePage() {
  return <WeldingService />
}
