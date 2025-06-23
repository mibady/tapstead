"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, CheckCircle, Shield, Star, Users, Sparkles, Leaf, ArrowRight, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const cleaningPackages = [
  {
    name: "Standard Clean",
    price: 99,
    duration: "2-3 hours",
    ideal: "Regular maintenance",
    includes: [
      "Dust all surfaces",
      "Vacuum all floors",
      "Mop hard floors",
      "Clean bathrooms",
      "Kitchen cleaning",
      "Trash removal",
    ],
  },
  {
    name: "Deep Clean",
    price: 179,
    duration: "4-6 hours",
    ideal: "First-time or seasonal",
    popular: true,
    includes: [
      "Everything in Standard",
      "Inside appliances",
      "Baseboards & windowsills",
      "Light fixtures",
      "Cabinet fronts",
      "Detailed bathroom scrub",
    ],
  },
  {
    name: "Move-In/Out Clean",
    price: 249,
    duration: "5-8 hours",
    ideal: "Moving homes",
    includes: [
      "Everything in Deep Clean",
      "Inside all cabinets",
      "Inside refrigerator",
      "Oven deep clean",
      "Window cleaning",
      "Garage sweep",
    ],
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "Maria and her team transformed my home! They were thorough, professional, and used eco-friendly products that didn't trigger my allergies.",
    service: "Deep Clean",
    location: "Austin, TX",
  },
  {
    name: "Mike Chen",
    rating: 5,
    text: "I've been using Tapstead's cleaning service monthly for 6 months. Consistent quality, always on time, and great communication.",
    service: "Standard Clean",
    location: "Seattle, WA",
  },
  {
    name: "Jennifer Davis",
    rating: 5,
    text: "The move-out cleaning was perfect! Got my full security deposit back thanks to their attention to detail.",
    service: "Move-Out Clean",
    location: "Denver, CO",
  },
]

const faqs = [
  {
    question: "Do I need to provide cleaning supplies?",
    answer:
      "No! Our professionals bring all necessary supplies and equipment, including eco-friendly cleaning products that are safe for your family and pets.",
  },
  {
    question: "How long does a typical cleaning take?",
    answer:
      "Standard cleans take 2-3 hours, deep cleans 4-6 hours, and move-in/out cleans 5-8 hours. Time varies based on home size and condition.",
  },
  {
    question: "Are your cleaners insured and background checked?",
    answer:
      "Yes! All our cleaning professionals are fully insured, bonded, and have passed comprehensive background checks for your peace of mind.",
  },
  {
    question: "What if I'm not satisfied with the cleaning?",
    answer:
      "We offer a 100% satisfaction guarantee. If you're not happy, we'll return within 24 hours to make it right at no extra charge.",
  },
  {
    question: "Can I schedule recurring cleanings?",
    answer: "We offer weekly, bi-weekly, and monthly recurring services with discounted rates for regular customers.",
  },
]

export default function HouseCleaningService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                <Star className="w-3 h-3 mr-1" />
                Most Popular Service
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Professional House Cleaning Services</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your home with our trusted cleaning professionals. Eco-friendly products, flexible scheduling,
                and a satisfaction guarantee that gives you peace of mind.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/book-now?service=house-cleaning">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now - Starting at $99
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
                  Insured & Bonded
                </div>
                <div className="flex items-center">
                  <Leaf className="w-4 h-4 mr-1 text-green-600" />
                  Eco-Friendly
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  Satisfaction Guaranteed
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/services/House Cleaning.png"
                alt="Professional house cleaning service"
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
                  <span className="text-gray-600">from 2,500+ cleans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cleaning Packages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Cleaning Package</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From regular maintenance to deep seasonal cleans, we have the perfect package for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cleaningPackages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? "ring-2 ring-blue-500 shadow-lg" : ""}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="text-4xl font-bold text-blue-600 mb-2">${pkg.price}</div>
                  <CardDescription className="text-gray-600">
                    {pkg.duration} • {pkg.ideal}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link
                      href={`/book-now?service=house-cleaning&package=${pkg.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      Select {pkg.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Cleaning Service Works</h2>
            <p className="text-xl text-gray-600">Simple, transparent, and hassle-free</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Book Online",
                description: "Choose your package, date, and time in just a few clicks",
                icon: Calendar,
              },
              {
                step: "2",
                title: "We Match You",
                description: "Get paired with vetted, insured cleaning professionals in your area",
                icon: Users,
              },
              {
                step: "3",
                title: "They Clean",
                description: "Sit back while our pros transform your home with eco-friendly products",
                icon: Sparkles,
              },
              {
                step: "4",
                title: "You Relax",
                description: "Enjoy your spotless home with our satisfaction guarantee",
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
            <p className="text-xl text-gray-600">Real reviews from real customers</p>
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
            <p className="text-xl text-gray-600">Everything you need to know about our cleaning services</p>
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
          <h2 className="text-4xl font-bold mb-4">Ready for a Spotless Home?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust Tapstead for their cleaning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/book-now?service=house-cleaning">
                Book Your Cleaning Today
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
