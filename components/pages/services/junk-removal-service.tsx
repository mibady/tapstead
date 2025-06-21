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
  Truck,
  Recycle,
  ArrowRight,
  Phone,
  Calendar,
  Package,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const junkRemovalServices = [
  {
    category: "Furniture Removal",
    price: "Starting at $149",
    popular: true,
    services: [
      "Old furniture pickup",
      "Mattress & box springs",
      "Appliance removal",
      "Electronics disposal",
      "Same-day service",
      "Donation coordination",
    ],
  },
  {
    category: "Construction Debris",
    price: "Starting at $199",
    services: [
      "Renovation waste",
      "Drywall & lumber",
      "Flooring materials",
      "Roofing debris",
      "Concrete & brick",
      "Proper disposal",
    ],
  },
  {
    category: "Estate Cleanouts",
    price: "Starting at $299",
    services: [
      "Full house cleanouts",
      "Basement clearing",
      "Garage cleanouts",
      "Storage unit clearing",
      "Sensitive item handling",
      "Donation sorting",
    ],
  },
]

const testimonials = [
  {
    name: "Jennifer Walsh",
    rating: 5,
    text: "Fantastic service! They removed an old couch, refrigerator, and tons of boxes from my garage. Professional, efficient, and reasonably priced.",
    service: "Furniture Removal",
    location: "Dallas, TX",
  },
  {
    name: "Mike Rodriguez",
    rating: 5,
    text: "After our kitchen renovation, we had so much debris. They cleared everything in one trip and left the area spotless. Highly recommend!",
    service: "Construction Debris",
    location: "San Antonio, TX",
  },
  {
    name: "Susan Chen",
    rating: 5,
    text: "Helped clear out my mother's house after she moved to assisted living. They were respectful, careful with donations, and made a difficult time easier.",
    service: "Estate Cleanout",
    location: "Portland, OR",
  },
]

const faqs = [
  {
    question: "How do you price junk removal services?",
    answer:
      "We price based on volume and type of items. Most jobs are quoted upfront with no hidden fees. We offer free estimates for larger jobs over $300.",
  },
  {
    question: "Do you donate items that are still usable?",
    answer:
      "Yes! We partner with local charities and donation centers. Items in good condition are donated when possible, and we'll provide donation receipts.",
  },
  {
    question: "Can you remove items from inside my home?",
    answer:
      "Our team will carefully remove items from anywhere in your home, including basements, attics, and upper floors. We protect your property during removal.",
  },
  {
    question: "Do you handle hazardous materials?",
    answer:
      "We cannot remove hazardous materials like paint, chemicals, asbestos, or medical waste. We'll help you find proper disposal resources for these items.",
  },
  {
    question: "How quickly can you schedule pickup?",
    answer:
      "We offer same-day and next-day service in most areas. For large estate cleanouts, we typically schedule within 2-3 days to ensure proper crew size.",
  },
]

export function JunkRemovalService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                <Recycle className="w-3 h-3 mr-1" />
                Eco-Friendly Disposal
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Professional Junk Removal Services</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Clear out unwanted items quickly and responsibly. From single items to full estate cleanouts, we handle
                the heavy lifting while prioritizing donation and recycling.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/book-now?service=junk-removal">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now - Starting at $149
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
                  Fully Insured
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-green-600" />
                  Same-Day Service
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  No Hidden Fees
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Professional junk removal service"
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
                  <span className="text-gray-600">from 2,800+ removals</span>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Junk Removal Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional removal services for any size job, with responsible disposal and recycling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {junkRemovalServices.map((category, index) => (
              <Card key={index} className={`relative ${category.popular ? "ring-2 ring-green-500 shadow-lg" : ""}`}>
                {category.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{category.category}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-green-600">{category.price}</CardDescription>
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

                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <Link
                      href={`/book-now?service=junk-removal&category=${category.category.toLowerCase().replace(/\s+/g, "-")}`}
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

      {/* Environmental Impact */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Responsible Disposal</h2>
            <p className="text-xl text-gray-600">We prioritize the environment in everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Recycle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>80% Recycled</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We recycle or donate 80% of items we collect, keeping them out of landfills.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Package className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Donation Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Working with local charities to give usable items a second life in the community.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Proper Disposal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Electronics and hazardous materials are disposed of according to local regulations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Junk Removal Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and environmentally responsible</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Book Online",
                description: "Schedule your pickup and describe what needs to be removed",
                icon: Calendar,
              },
              {
                step: "2",
                title: "We Arrive",
                description: "Professional team arrives with truck and equipment",
                icon: Truck,
              },
              {
                step: "3",
                title: "Load & Remove",
                description: "We handle all the heavy lifting and loading safely",
                icon: Users,
              },
              {
                step: "4",
                title: "Responsible Disposal",
                description: "Items are donated, recycled, or properly disposed of",
                icon: Recycle,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <step.icon className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
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
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our junk removal services</p>
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
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Clear Out That Clutter?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let us handle the heavy lifting while you enjoy your newly organized space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
              <Link href="/book-now?service=junk-removal">
                Book Junk Removal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
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
