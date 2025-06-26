"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Waves,
  CheckCircle,
  Shield,
  Star,
  Users,
  Home,
  CloudRain,
  ArrowRight,
  Phone,
  Calendar,
  Leaf,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const gutterServices = [
  {
    category: "Gutter Cleaning",
    price: "Starting at $159",
    popular: true,
    services: [
      "Complete debris removal",
      "Downspout clearing",
      "Gutter flushing",
      "Minor leak inspection",
      "Before/after photos",
      "Seasonal maintenance",
    ],
  },
  {
    category: "Gutter Repairs",
    price: "Starting at $89/hr",
    services: [
      "Leak sealing",
      "Sagging gutter fixes",
      "Bracket replacement",
      "Downspout repairs",
      "Joint resealing",
      "Slope adjustments",
    ],
  },
  {
    category: "Gutter Installation",
    price: "Starting at $8/linear ft",
    services: [
      "New gutter systems",
      "Gutter guard installation",
      "Downspout placement",
      "Seamless gutters",
      "Custom color matching",
      "Warranty included",
    ],
  },
]

const testimonials = [
  {
    name: "Mark Johnson",
    rating: 5,
    text: "Excellent gutter cleaning service! They removed years of debris and fixed a small leak I didn't even know about. Very thorough work.",
    service: "Gutter Cleaning",
    location: "Seattle, WA",
  },
  {
    name: "Patricia Lee",
    rating: 5,
    text: "Had new gutters installed after storm damage. Professional installation, great materials, and they cleaned up perfectly. Highly recommend!",
    service: "Gutter Installation",
    location: "Atlanta, GA",
  },
  {
    name: "Carlos Martinez",
    rating: 5,
    text: "Fixed multiple leaks and adjusted the slope on my gutters. No more water pooling! Fair pricing and quality workmanship.",
    service: "Gutter Repairs",
    location: "Phoenix, AZ",
  },
]

const faqs = [
  {
    question: "How often should gutters be cleaned?",
    answer:
      "Most homes need gutter cleaning twice a year - spring and fall. Homes with many trees may need quarterly cleaning to prevent clogs and overflow.",
  },
  {
    question: "Do you provide gutter guards installation?",
    answer:
      "Yes! We install various types of gutter guards to reduce debris buildup and minimize future cleaning needs. We'll recommend the best option for your home.",
  },
  {
    question: "What happens if you find damage during cleaning?",
    answer:
      "We'll document any issues with photos and provide a detailed estimate for repairs. You're never obligated to proceed, but we can often fix minor issues on the spot.",
  },
  {
    question: "Do you clean gutters on multi-story homes?",
    answer:
      "Yes, we service homes up to 3 stories with proper safety equipment. Our technicians are trained and insured for high-elevation work.",
  },
  {
    question: "Is gutter cleaning included in repair services?",
    answer:
      "Basic cleaning is included with most repair services. For heavily clogged gutters, we may recommend a full cleaning service for optimal results.",
  },
]

export function GutterService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Image */}
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl order-last lg:order-first">
              <img
                src="/images/services/Professional Gutter.png"
                alt="Professional Gutter Services"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent lg:hidden"></div>
              <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-md">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-1 font-semibold text-sm">4.8/5</span>
                  <span className="text-xs text-gray-600">(1,200+ jobs)</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                <CloudRain className="h-5 w-5" />
                <span className="font-medium">Weather Protection Specialists</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Expert <span className="text-blue-600">Gutter</span> Services
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl lg:max-w-none mx-auto lg:mx-0">
                Protect your home's foundation with expert gutter cleaning, repairs, and installation. 
                Prevent water damage and maintain your property's value with our comprehensive gutter services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/book-now?service=gutter-services">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Now - $159+
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Phone className="mr-2 h-5 w-5" />
                  (555) 123-4567
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm text-gray-600">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Fully Insured</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Leaf className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Debris Removal</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Gutter Guards</span>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Gutter Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete gutter solutions to protect your home from water damage year-round.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gutterServices.map((category, index) => (
              <Card key={index} className={`relative ${category.popular ? "ring-2 ring-blue-500 shadow-lg" : ""}`}>
                {category.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
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

                  <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link
                      href={`/book-now?service=gutter-services&category=${category.category.toLowerCase().replace(/\s+/g, "-")}`}
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

      {/* Seasonal Alert */}
      <section className="py-12 bg-amber-50 border-l-4 border-amber-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
              <div>
                <h3 className="text-xl font-bold text-amber-900">Fall & Spring Cleaning Season</h3>
                <p className="text-amber-700">
                  Book now to prevent ice dams and water damage. Peak season scheduling fills up quickly.
                </p>
              </div>
            </div>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
              <Link href="/book-now?service=gutter-services">Schedule Cleaning</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Gutter Service Works</h2>
            <p className="text-xl text-gray-600">Professional gutter care to protect your home</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Schedule Service",
                description: "Book your gutter cleaning, repair, or installation online",
                icon: Calendar,
              },
              {
                step: "2",
                title: "Professional Inspection",
                description: "Thorough assessment of your gutter system and needs",
                icon: Users,
              },
              {
                step: "3",
                title: "Expert Service",
                description: "Complete cleaning, repairs, or installation with quality materials",
                icon: Waves,
              },
              {
                step: "4",
                title: "Protection Complete",
                description: "Your home is protected with properly functioning gutters",
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
            <p className="text-xl text-gray-600">Real reviews from protected homeowners</p>
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
            <p className="text-xl text-gray-600">Everything you need to know about our gutter services</p>
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
          <h2 className="text-4xl font-bold mb-4">Protect Your Home Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't wait for water damage. Keep your gutters clean and functioning properly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/book-now?service=gutter-services">
                Book Gutter Service
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
