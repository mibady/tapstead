import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle, Shield, Clock, Zap } from "lucide-react"
import Link from "next/link"

export function EmergencyDisasterCleanupService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Emergency <span className="text-orange-200">Disaster Cleanup</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
            24/7 emergency response for all types of disaster cleanup. Professional restoration services when you need
            them most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4" asChild>
              <Link href="/book-now">Emergency Response</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              Call: (555) DISASTER
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-200" />
              24/7 Emergency Response
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-orange-200" />
              Insurance Approved
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-200" />
              Rapid Response Team
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
