import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Phone, Shield, Wind, TreePine, Home } from "lucide-react"
import Link from "next/link"

export function StormDamageCleanupService() {
  const services = [
    {
      icon: <Wind className="w-6 h-6" />,
      title: "Wind Damage Cleanup",
      description: "Debris removal, roof repairs, and structural assessments",
    },
    {
      icon: <TreePine className="w-6 h-6" />,
      title: "Tree Removal",
      description: "Safe removal of fallen trees and dangerous branches",
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Property Restoration",
      description: "Complete cleanup and restoration services",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Emergency Boarding",
      description: "Secure your property with emergency board-up services",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Wind className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Emergency <span className="text-red-200">Storm Damage</span> Cleanup
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
            24/7 emergency response for storm damage cleanup and debris removal. Professional restoration services to
            get your property back to normal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4" asChild>
              <Link href="/book-now">Book Emergency Service</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              Emergency: (555) STORM-911
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-red-200" />
              24/7 Emergency Response
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-red-200" />
              Insurance Approved
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-red-200" />
              Licensed & Bonded
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Storm Damage Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive storm damage cleanup and restoration services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-lg mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
