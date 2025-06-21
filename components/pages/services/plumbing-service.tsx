"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Clock,
  Shield,
  Star,
  Users,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Phone,
  Calendar,
  Home,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const plumbingServices = [
  {
    category: "Emergency Repairs",
    price: "Starting at $125/hr",
    urgent: true,
    services: [
      "Burst pipe repairs",
      "Severe leak fixes",
      "Clogged drain clearing",
      "Water heater emergencies",
      "Toilet overflows",
      "Sewer line backups",
    ],
  },
  {
    category: "Fixture Installation",
    price: "Starting at $89/hr",
    popular: true,
    services: [
      "Faucet installation",
      "Toilet replacement",
      "Shower head upgrades",
      "Garbage disposal install",
      "Water filtration systems",
      "Bathroom vanity plumbing",
    ],
  },
  {
    category: "Maintenance & Repairs",
    price: "Starting at $79/hr",
    services: [
      "Leak detection & repair",
      "Pipe insulation",
      "Water pressure issues",
      "Running toilet fixes",
      "Faucet repairs",
      "Preventive maintenance",
    ],
  },
]

const testimonials = [
  {
    name: "Amanda Rodriguez",
    rating: 5,
    text: "Had a burst pipe at 2 AM and they were here within an hour! Professional, efficient, and saved my hardwood floors. Excellent emergency service.",
    service: "Emergency Repair",
    location: "Miami, FL",
  },
  {
    name: "Tom Wilson",
    rating: 5,
    text: "Installed a new toilet and fixed two leaky faucets. Clean work, fair pricing, and explained everything clearly. Very satisfied!",
    service: "Fixture Installation",
    location: "Chicago, IL",
  },
  {
    name: "Sarah Chen",
    rating: 5,
    text: "Regular maintenance service has prevented major issues. The plumber is knowledgeable and always on time. Great preventive care!",
    service: "Maintenance",
    location: "San Diego, CA",
  },
]

const faqs = [
  {
    question: "Do you offer 24/7 emergency plumbing services?",
    answer:
      "Yes! We provide 24/7 emergency plumbing services for urgent issues like burst pipes, severe leaks, and sewer backups. Emergency rates apply for after-hours calls.",
  },
  {
    question: "Are your plumbers licensed and insured?",
    answer:
      "All our plumbers are fully licensed, bonded, and insured. They undergo regular training to stay current with codes and best practices.",
  },
  {
    question: "Do you provide warranties on plumbing work?",
    answer:
      "Yes, we provide warranties on both labor and parts. Installation work comes with a 1-year warranty, and we use quality parts with manufacturer warranties.",
  },
  {
    question: "How do you handle emergency plumbing situations?",
    answer:
      "For emergencies, call our hotline and we'll dispatch the nearest available plumber. We aim for 1-hour response times for true emergencies in our service areas.",
  },
  {
    question: "Can you help with water damage from plumbing issues?",
    answer:
      "We focus on stopping the source of water damage and can coordinate with water damage restoration specialists if needed. We also work with insurance companies.",
  },
]

export function PlumbingService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                24/7 Emergency Service
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Professional Plumbing Services</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                From emergency repairs to routine maintenance, our licensed plumbers handle all your plumbing needs.
                Fast response times, quality work, and transparent pricing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/book-now?service=plumbing">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now - Starting at $79/hr
                  </Link>
                </Button>
                <Button size="lg" variant="destructive" asChild>
                  <Link href="tel:555-DISASTER">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency: (555) DISASTER
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-600" />
                  Licensed & Insured
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-green-600" />
                  24/7 Emergency
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  Parts Warranty
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Professional plumbing service"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-gray-600">from 3,200+ jobs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Plumbing Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive plumbing solutions from emergency repairs to planned installations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plumbingServices.map((category, index) => (
              <Card
                key={index}
                className={`relative ${category.popular ? "ring-2 ring-blue-500 shadow-lg" : category.urgent ? "ring-2 ring-red-500 shadow-lg" : ""}`}
              >
                {category.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                {category.urgent && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600">
                    Emergency Service
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{category.category}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-blue-600">{category.price}</CardDescription>
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

                  <Button
                    className={`w-full ${category.urgent ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    asChild
                  >
                    <Link
                      href={`/book-now?service=plumbing&category=${category.category.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {category.urgent ? "Emergency Service" : `Book ${category.category}`}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Alert */}
      <section className="py-12 bg-red-50 border-l-4 border-red-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="text-xl font-bold text-red-900">Plumbing Emergency?</h3>
                <p className="text-red-700">
                  Don't wait - water damage gets worse every minute. Call now for immediate help.
                </p>
              </div>
            </div>
            <Button size="lg" variant="destructive" asChild>
              <Link href="tel:555-DISASTER">Call Emergency Line</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Plumbing Service Works</h2>
            <p className="text-xl text-gray-600">Professional plumbing solutions when you need them</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Call or Book",
                description: "Describe your plumbing issue or schedule routine service",
                icon: Phone,
              },
              {
                step: "2",
                title: "Quick Response",
                description: "Licensed plumber dispatched to your location quickly",
                icon: Users,
              },
              {
                step: "3",
                title: "Expert Diagnosis",
                description: "Professional assessment and transparent pricing upfront",
                icon: Wrench,
              },
              {
                step: "4",
                title: "Quality Repair",
                description: "Efficient repair with warranty and clean workspace",
                icon: Home,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <step.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real reviews from satisfied customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Badge variant="secondary">{testimonial.service}</Badge>
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our plumbing services</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Need Plumbing Help?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't let plumbing problems disrupt your day. Get professional help now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/book-now?service=plumbing">
                Book Plumbing Service
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="tel:555-DISASTER">Emergency Hotline</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
