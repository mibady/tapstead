"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Award,
  Lightbulb,
  Home,
  AlertTriangle,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function ElectricalService() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const electricalServices = [
    {
      id: "outlet-installation",
      name: "Outlet Installation & Repair",
      description: "New outlet installation, GFCI upgrades, and outlet repairs",
      price: "Starting at $125",
      duration: "1-2 hours",
      features: ["GFCI outlets", "USB outlets", "Code compliance", "Safety testing"],
    },
    {
      id: "lighting-installation",
      name: "Light Fixture Installation",
      description: "Ceiling fans, chandeliers, recessed lighting, and outdoor fixtures",
      price: "Starting at $150",
      duration: "1-3 hours",
      features: ["Indoor/outdoor lighting", "Ceiling fans", "Dimmer switches", "LED upgrades"],
    },
    {
      id: "panel-upgrades",
      name: "Electrical Panel Upgrades",
      description: "Panel replacements, circuit additions, and electrical upgrades",
      price: "Starting at $800",
      duration: "4-8 hours",
      features: ["200A panels", "Circuit breakers", "Code updates", "Permit handling"],
    },
    {
      id: "wiring-repair",
      name: "Electrical Wiring & Repair",
      description: "Troubleshooting, rewiring, and electrical system repairs",
      price: "Starting at $200",
      duration: "2-4 hours",
      features: ["Fault diagnosis", "Wire replacement", "Safety inspections", "Code compliance"],
    },
    {
      id: "emergency-electrical",
      name: "Emergency Electrical Services",
      description: "24/7 emergency electrical repairs and safety issues",
      price: "Starting at $300",
      duration: "Same day",
      features: ["24/7 availability", "Power outages", "Safety hazards", "Urgent repairs"],
    },
    {
      id: "smart-home",
      name: "Smart Home Electrical",
      description: "Smart switches, outlets, and home automation wiring",
      price: "Starting at $175",
      duration: "1-3 hours",
      features: ["Smart switches", "Automated lighting", "Home integration", "App control"],
    },
  ]

  const whyChooseUs = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Licensed & Insured",
      description: "All electricians are fully licensed, bonded, and insured for your protection",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Same-Day Service",
      description: "Emergency electrical services available 24/7 with same-day scheduling",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Code Compliant",
      description: "All work meets or exceeds local electrical codes and safety standards",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Upfront Pricing",
      description: "Transparent, fixed pricing with no hidden fees or surprise charges",
    },
  ]

  const safetyFeatures = [
    "Licensed Master Electricians",
    "Comprehensive Safety Inspections",
    "Code Compliance Guaranteed",
    "Permit Handling Included",
    "Warranty on All Work",
    "Emergency Response Available",
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Bellevue, WA",
      rating: 5,
      text: "Excellent electrical work! They installed new outlets in our kitchen and upgraded our panel. Professional, clean, and reasonably priced.",
      service: "Panel Upgrade & Outlets",
    },
    {
      name: "Mike Chen",
      location: "Seattle, WA",
      rating: 5,
      text: "Emergency call for a power outage issue. They came out the same day and fixed everything quickly. Highly recommend!",
      service: "Emergency Electrical",
    },
    {
      name: "Lisa Rodriguez",
      location: "Tacoma, WA",
      rating: 5,
      text: "Great experience with smart home installation. They set up all our smart switches and explained everything clearly.",
      service: "Smart Home Electrical",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Zap className="w-4 h-4 mr-1" />
                Licensed Electrical Services
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Professional Electrical Services in the Pacific Northwest
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Licensed electricians providing safe, reliable electrical installations, repairs, and upgrades. From
                outlet installation to panel upgrades, we handle all your electrical needs with transparent pricing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/book-now">Book Electrical Service</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="tel:(360) 641-7386">
                    <Phone className="w-4 h-4 mr-2" />
                    Call (360) 641-7386
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Same-Day Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Code Compliant</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/services/electrical-services-hero.png"
                alt="Professional electrician working on electrical panel"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">24/7 Emergency</div>
                    <div className="text-sm text-gray-600">Same-day response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Complete Electrical Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From simple outlet installations to complex panel upgrades, our licensed electricians handle all
              residential and commercial electrical needs safely and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {electricalServices.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedService === service.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{service.name}</span>
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                      <Badge variant="secondary">{service.duration}</Badge>
                    </div>

                    {selectedService === service.id && (
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-semibold text-gray-900">Included:</h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full mt-4" asChild>
                          <Link href="/book-now">Book This Service</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Electrical Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional, licensed electricians committed to safety, quality, and customer satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">{item.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Compliance Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-200">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Safety First
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Licensed Electricians You Can Trust</h2>
              <p className="text-lg text-gray-600 mb-8">
                Electrical work requires expertise and attention to safety. Our licensed master electricians ensure all
                work meets or exceeds local codes and safety standards, protecting your home and family.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {safetyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/book-now">Schedule Electrical Service</Link>
              </Button>
            </div>

            <div className="relative">
              <Image
                src="/images/services/electrical-safety.png"
                alt="Electrical safety and code compliance"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real reviews from satisfied customers across the Pacific Northwest</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services Section */}
      <section className="py-16 lg:py-24 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">24/7 Emergency Electrical Services</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Electrical emergencies don't wait for business hours. Our emergency electricians are available 24/7 to
              handle power outages, electrical hazards, and urgent repairs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="tel:(360) 641-7386">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency: (360) 641-7386
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/book-now">Schedule Non-Emergency Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Serving the Pacific Northwest</h2>
            <p className="text-xl text-gray-600">
              Professional electrical services across the greater Seattle area and beyond
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              "Seattle",
              "Bellevue",
              "Tacoma",
              "Everett",
              "Redmond",
              "Kirkland",
              "Renton",
              "Federal Way",
              "Lynnwood",
              "Bothell",
              "Issaquah",
              "Lakewood",
            ].map((city) => (
              <div key={city} className="bg-gray-50 p-4 rounded-lg">
                <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <span className="font-medium text-gray-900">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready for Professional Electrical Service?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get started with transparent pricing, licensed electricians, and guaranteed quality work. Book online or
            call for same-day service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/book-now">Book Electrical Service</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="tel:(360) 641-7386">
                <Phone className="w-4 h-4 mr-2" />
                Call (360) 641-7386
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ElectricalService
