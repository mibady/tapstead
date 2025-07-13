"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  Trash2,
  Wind,
  Flame,
  ArrowRight,
  Clock,
  Calculator,
} from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: "house-cleaning",
    icon: Home,
    title: "House Cleaning",
    description: "Professional residential cleaning with eco-friendly products",
    type: "instant",
    pricing: "$149 - $299",
    duration: "2-4 hours",
    popular: true,
    features: [
      "All rooms cleaned thoroughly",
      "Kitchen & bathroom deep clean",
      "Eco-friendly products",
      "Flexible scheduling",
    ],
    href: "/book-now",
  },
  {
    id: "handyman",
    icon: Wrench,
    title: "Handyman Services",
    description: "General repairs, installations, and home maintenance",
    type: "quote",
    pricing: "Custom Quote",
    duration: "1-8 hours",
    features: ["General repairs", "Installations", "Maintenance work", "Licensed professionals"],
    href: "/services/handyman",
  },
  {
    id: "painting",
    icon: Paintbrush,
    title: "Painting Services",
    description: "Interior and exterior painting by skilled professionals",
    type: "quote",
    pricing: "Custom Quote",
    duration: "1-5 days",
    features: ["Interior & exterior", "Premium paint brands", "Color consultation", "Clean-up included"],
    href: "/services/painting",
  },
  {
    id: "electrical",
    icon: Zap,
    title: "Electrical Work",
    description: "Licensed electricians for all your electrical needs",
    type: "quote",
    pricing: "Custom Quote",
    duration: "1-6 hours",
    features: ["Licensed electricians", "Safety inspections", "Installations & repairs", "Emergency service"],
    href: "/services/electrical",
  },
  {
    id: "plumbing",
    icon: Droplets,
    title: "Plumbing Services",
    description: "Expert plumbers for repairs, installations, and emergencies",
    type: "quote",
    pricing: "Custom Quote",
    duration: "1-4 hours",
    features: ["Emergency repairs", "Pipe installations", "Drain cleaning", "Water heater service"],
    href: "/services/plumbing",
  },
  {
    id: "junk-removal",
    icon: Trash2,
    title: "Junk Removal",
    description: "Fast and eco-friendly junk removal and disposal",
    type: "quote",
    pricing: "Custom Quote",
    duration: "1-3 hours",
    features: ["Same-day service", "Eco-friendly disposal", "Heavy lifting included", "Clean-up after removal"],
    href: "/services/junk-removal",
  },
  {
    id: "pressure-washing",
    icon: Wind,
    title: "Pressure Washing",
    description: "Professional pressure washing for homes and driveways",
    type: "quote",
    pricing: "Custom Quote",
    duration: "2-6 hours",
    features: ["House exterior cleaning", "Driveway & walkways", "Deck & patio cleaning", "Eco-friendly detergents"],
    href: "/services/pressure-washing",
  },
  {
    id: "emergency-cleanup",
    icon: Flame,
    title: "Emergency Cleanup",
    description: "24/7 emergency cleanup for disasters and accidents",
    type: "emergency",
    pricing: "Emergency Rates",
    duration: "Immediate",
    features: ["24/7 availability", "Disaster cleanup", "Insurance coordination", "Rapid response"],
    href: "/emergency",
  },
]

export function ServicesSection() {
  const primaryService = services.find((s) => s.id === "house-cleaning")
  const otherServices = services.filter((s) => s.id !== "house-cleaning")

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From instant house cleaning bookings to custom quotes for specialized services
          </p>
        </div>

        {/* Primary Service - House Cleaning */}
        {primaryService && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">Most Popular Service</Badge>
            </div>

            <Card className="max-w-4xl mx-auto border-2 border-blue-200 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <primaryService.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-3xl">{primaryService.title}</CardTitle>
                <CardDescription className="text-lg">{primaryService.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">{primaryService.pricing}</div>
                    <div className="text-sm text-gray-600">Fixed pricing based on home size</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">{primaryService.duration}</div>
                    <div className="text-sm text-gray-600">Professional service time</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">Instant</div>
                    <div className="text-sm text-gray-600">Book online immediately</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {primaryService.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-semibold text-green-800 mb-2">Save with Subscriptions</div>
                      <div className="text-sm text-green-700">
                        • Weekly: Save 33%
                        <br />• Bi-weekly: Save 27%
                        <br />• Monthly: Save 20%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 min-w-[200px]" asChild>
                    <Link href={primaryService.href}>
                      Book House Cleaning Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="min-w-[180px] bg-transparent" asChild>
                    <Link href="/pricing">View Pricing Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other Services */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Other Professional Services</h3>
            <p className="text-gray-600">Custom quotes delivered within 2 hours</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    {service.type === "emergency" && <Badge className="bg-red-100 text-red-800">24/7</Badge>}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Calculator className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{service.pricing}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{service.duration}</span>
                    </div>
                  </div>

                  <ul className="space-y-1 flex-grow">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 mt-auto">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href={service.href} className="flex items-center justify-center">
                        <span>{service.type === "emergency" ? "Emergency Contact" : "Get Quote"}</span>
                        <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need Something Else?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Contact us for custom services and specialized solutions.
            </p>
            <Button size="lg" variant="outline" className="min-w-[140px] bg-transparent" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
