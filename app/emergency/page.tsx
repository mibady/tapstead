import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EmergencyServices } from "@/components/pages/emergency-services"

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <EmergencyServices />
      </main>
      <Footer />
    </div>
  )
}
