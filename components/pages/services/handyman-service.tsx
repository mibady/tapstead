"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Wrench, Home, Zap, Paintbrush, Hammer } from "lucide-react"
import Image from "next/image"

export function HandymanService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
                Professional Handyman Services
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                From Quick Fixes to Complex Installations
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Skilled handymen with all the tools and expertise to get the job done right. Licensed professionals for
                reliable home repairs and improvements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gradient-ocean">
                  Book Handyman Service
                </Button>
                <Button size="lg" variant="outline">
                  Get Free Quote
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/services/handyman-services-hero.png"
                alt="Professional handyman service"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Handyman Services</h2>
            <p className="text-lg text-gray-600">Professional solutions for all your home repair needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Hammer className="h-8 w-8 text-orange-600" />,
                title: "General Repairs",
                description: "Fix leaks, squeaks, and broken fixtures",
                features: ["Faucet repairs", "Door adjustments", "Window fixes", "Cabinet repairs"],
              },
              {
                icon: <Zap className="h-8 w-8 text-yellow-600" />,
                title: "Electrical Work",
                description: "Safe electrical installations and repairs",
                features: [
                  "Outlet installation",
                  "Light fixture mounting",
                  "Switch replacement",
                  "Ceiling fan installation",
                ],
              },
              {
                icon: <Paintbrush className="h-8 w-8 text-blue-600" />,
                title: "Painting & Touch-ups",
                description: "Interior and exterior painting services",
                features: ["Room painting", "Touch-up work", "Trim painting", "Deck staining"],
              },
              {
                icon: <Home className="h-8 w-8 text-green-600" />,
                title: "Home Assembly",
                description: "Furniture and fixture assembly",
                features: ["Furniture assembly", "Shelf installation", "TV mounting", "Closet organization"],
              },
              {
                icon: <Wrench className="h-8 w-8 text-purple-600" />,
                title: "Plumbing Fixes",
                description: "Minor plumbing repairs and installations",
                features: ["Toilet repairs", "Sink installation", "Garbage disposal", "Pipe fixes"],
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-teal-600" />,
                title: "Home Maintenance",
                description: "Regular upkeep and preventive care",
                features: ["Caulking", "Weather stripping", "Gutter cleaning", "Pressure washing"],
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Reliable Handyman?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Get your home repairs done right the first time with our skilled professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Book Service Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              Get Free Estimate
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
