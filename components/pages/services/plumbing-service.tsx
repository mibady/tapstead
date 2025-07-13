"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Wrench, Droplets, AlertTriangle, Clock, Shield } from "lucide-react"
import Image from "next/image"

export function PlumbingService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Licensed Professional Plumbers</Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Expert Plumbing Services You Can Trust
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                From emergency repairs to routine maintenance, our licensed plumbers handle all your plumbing needs.
                Fast response times, quality work, and transparent pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gradient-ocean">
                  Book Plumber Now
                </Button>
                <Button size="lg" variant="outline">
                  Emergency Service
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/services/plumbing-services-hero.png"
                alt="Professional plumbing service"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Plumbing Services</h2>
            <p className="text-lg text-gray-600">
              Comprehensive plumbing solutions for residential and commercial properties
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
                title: "Emergency Plumbing",
                description: "24/7 emergency response for urgent issues",
                features: ["Burst pipe repair", "Severe leaks", "Blocked drains", "Water heater failure"],
              },
              {
                icon: <Droplets className="h-8 w-8 text-blue-600" />,
                title: "Leak Detection & Repair",
                description: "Advanced leak detection and professional repairs",
                features: ["Hidden leak detection", "Pipe repairs", "Faucet fixes", "Toilet repairs"],
              },
              {
                icon: <Wrench className="h-8 w-8 text-gray-600" />,
                title: "Drain Cleaning",
                description: "Professional drain and sewer line cleaning",
                features: ["Clogged drains", "Sewer line cleaning", "Root removal", "Preventive maintenance"],
              },
              {
                icon: <Shield className="h-8 w-8 text-green-600" />,
                title: "Water Heater Service",
                description: "Installation, repair, and maintenance",
                features: ["New installations", "Repairs & maintenance", "Tank replacement", "Efficiency upgrades"],
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-purple-600" />,
                title: "Fixture Installation",
                description: "Professional installation of plumbing fixtures",
                features: ["Sink installation", "Toilet replacement", "Shower installation", "Garbage disposals"],
              },
              {
                icon: <Clock className="h-8 w-8 text-orange-600" />,
                title: "Preventive Maintenance",
                description: "Regular maintenance to prevent costly repairs",
                features: ["Annual inspections", "Pipe maintenance", "Water pressure checks", "System optimization"],
              },
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {service.icon}
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Professional Plumbing Service?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't let plumbing problems disrupt your day. Call our licensed professionals now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Schedule Service
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Emergency Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
