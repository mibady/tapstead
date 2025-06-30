import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Phone, Clock, Shield, AlertTriangle, CheckCircle, Truck, Wind } from "lucide-react"
import Link from "next/link"

const disasterServices = [
  {
    icon: Flame,
    title: "Fire Debris Removal",
    description: "Complete fire damage cleanup and debris removal services",
    features: [
      "24/7 Emergency Response",
      "Hazmat Certified Teams",
      "Insurance Coordination",
      "Structural Debris Removal",
      "Ash & Soot Cleanup",
      "Hazardous Material Disposal",
    ],
    responseTime: "2-4 hours",
    coverage: "Fire damage restoration",
    certification: "EPA & OSHA Certified",
  },
  {
    icon: Wind,
    title: "Storm Damage Cleanup",
    description: "Emergency cleanup after storms, hurricanes, and natural disasters",
    features: [
      "Emergency Tree Removal",
      "Roof Debris Cleanup",
      "Water Damage Mitigation",
      "Structural Assessment",
      "Insurance Documentation",
      "24/7 Emergency Response",
    ],
    responseTime: "1-3 hours",
    coverage: "Storm & weather damage",
    certification: "IICRC Certified",
  },
  {
    icon: Truck,
    title: "Emergency Disaster Cleanup",
    description: "Rapid response for all types of disaster debris and emergency cleanup",
    features: [
      "Multi-Hazard Response",
      "Heavy Equipment Available",
      "Contamination Cleanup",
      "Site Stabilization",
      "Emergency Board-Up",
      "Debris Hauling & Disposal",
    ],
    responseTime: "1-2 hours",
    coverage: "All disaster types",
    certification: "FEMA Approved",
  },
]

export function EmergencyServicesSection() {
  return (
    <section className="py-20 bg-red-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Emergency Disaster Services</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            When disaster strikes, our certified emergency response teams are ready 24/7 to help you recover quickly and
            safely.
          </p>
        </div>

        {/* Emergency Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {disasterServices.map((service, index) => (
            <Card key={index} className="border-red-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <service.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                    <Badge className="bg-red-600 hover:bg-red-700 mt-2">Emergency Service</Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Info */}
                <div className="grid grid-cols-1 gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-red-600 mr-2" />
                    <div className="text-sm">
                      <span className="font-medium">Response:</span> {service.responseTime}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-red-600 mr-2" />
                    <div className="text-sm">
                      <span className="font-medium">Coverage:</span> {service.coverage}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-red-600 mr-2" />
                    <div className="text-sm">
                      <span className="font-medium">Certified:</span> {service.certification}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Service Includes:</h4>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                    <Link href={`/book-now?service=${service.title.toLowerCase().replace(/\s+/g, "-")}&emergency=true`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Emergency Call
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/book-now?service=${service.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      Schedule Service
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card className="bg-red-600 text-white">
          <CardContent className="p-8 text-center">
            <Phone className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">24/7 Emergency AI Assistant</h3>
            <p className="text-red-100 mb-6">
              For immediate emergency response after fires, storms, or disasters, call our AI emergency assistant. 
              Available 24/7 with instant routing to certified teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100" asChild>
                <a href="tel:13606417386">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (360) 641-7386
                </a>
              </Button>
              <div className="text-red-100 text-sm">AI answers instantly • Emergency teams deployed within 1-4 hours</div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance & Safety */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <Shield className="h-8 w-8 text-red-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Fully Insured</h4>
            <p className="text-gray-600 text-sm">$5M liability coverage for all emergency disaster services</p>
          </div>
          <div className="p-6">
            <CheckCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Certified Teams</h4>
            <p className="text-gray-600 text-sm">EPA, OSHA, IICRC, and FEMA certified professionals</p>
          </div>
          <div className="p-6">
            <Clock className="h-8 w-8 text-red-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Rapid Response</h4>
            <p className="text-gray-600 text-sm">Emergency teams deployed within 1-4 hours</p>
          </div>
        </div>
      </div>
    </section>
  )
}
