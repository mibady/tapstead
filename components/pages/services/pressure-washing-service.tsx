"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Camera, ArrowRight, Phone, Calendar, Leaf, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const pressureWashingServices = [
  {
    category: "Driveway & Walkways",
    price: "Starting at $199",
    popular: true,
    services: [
      "Concrete driveway cleaning",
      "Walkway restoration",
      "Oil stain removal",
      "Mold & mildew treatment",
      "Sealing available",
      "Before/after photos",
    ],
  },
  {
    category: "House & Siding",
    price: "Starting at $299",
    services: [
      "Vinyl siding cleaning",
      "Brick & stone washing",
      "Window exterior cleaning",
      "Gutter exterior cleaning",
      "Soft wash technique",
      "Eco-safe detergents",
    ],
  },
  {
    category: "Decks & Patios",
    price: "Starting at $249",
    services: [
      "Wood deck restoration",
      "Composite deck cleaning",
      "Patio stone cleaning",
      "Fence cleaning",
      "Staining prep",
      "Protective treatments",
    ],
  },
]

export function PressureWashingService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-50 to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-cyan-100 text-cyan-800 hover:bg-cyan-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Restore Like New
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Professional Pressure Washing Services</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your property's exterior with professional pressure washing. Remove years of dirt, grime, and
                stains to restore your home's curb appeal and protect your investment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700" asChild>
                  <Link href="/book-now?service=pressure-washing">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now - Starting at $199
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="tel:555-123-4567">
                    <Phone className="w-4 h-4 mr-2" />
                    Call (555) 123-4567
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-600" />
                  Professional Equipment
                </div>
                <div className="flex items-center">
                  <Leaf className="w-4 h-4 mr-1 text-green-600" />
                  Eco-Safe Detergents
                </div>
                <div className="flex items-center">
                  <Camera className="w-4 h-4 mr-1 text-green-600" />
                  Before/After Photos
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/services/Pressure Washing.png"
                alt="Professional pressure washing service"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Pressure Washing Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional cleaning for all your exterior surfaces with guaranteed results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pressureWashingServices.map((category, index) => (
              <Card key={index} className={`relative ${category.popular ? "ring-2 ring-cyan-500 shadow-lg" : ""}`}>
                {category.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-600">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{category.category}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-cyan-600">{category.price}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {category.services.map((service, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700" asChild>
                    <Link
                      href={`/book-now?service=pressure-washing&category=${category.category.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      Book {category.category}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Restore Your Property?</h2>
          <p className="text-xl mb-8 opacity-90">See the dramatic difference professional pressure washing can make.</p>
          <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100" asChild>
            <Link href="/book-now?service=pressure-washing">
              Book Pressure Washing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
