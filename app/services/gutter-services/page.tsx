import type { Metadata } from "next"
import { GutterService } from "@/components/pages/services/gutter-service"

export const metadata: Metadata = {
  title: "Professional Gutter Services | Tapstead",
  description:
    "Book professional gutter cleaning, repairs, installation, and maintenance. Protect your home with expert gutter services and downspout maintenance.",
  keywords: "gutter cleaning, gutter repair, gutter installation, downspout cleaning, gutter maintenance",
}

export default function GutterServicesPage() {
  return <GutterService />
}
