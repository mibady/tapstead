"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServiceHero } from "@/components/shared/service-hero"
import { CheckCircle, Shield, Wrench, Hammer, ArrowRight, Star, Home, Users } from "lucide-react"
import Link from "next/link"

const handymanServices = [
  {
    category: "Repairs & Fixes",
    price: "Starting at $75/hr",
    services: [
      "Drywall repair & patching",
      "Door & window adjustments",
      "Leaky faucet repairs",
      "Squeaky floor fixes",
      "Cabinet door alignment",
      "Tile replacement",
    ],
  },
  {
    category: "Installations",
    price: "Starting at $89/hr",
    popular: true,
    services: [
      "TV mounting & setup",
      "Ceiling fan installation",
      "Shelving & storage",
      "Curtain rod mounting",
      "Bathroom accessories",
      "Smart home devices",
    ],
  },
  {
    category: "Assembly & Setup",
    price: "Starting at $65/hr",
    services: [
      "Furniture assembly",
      "Exercise equipment setup",
      "Playground equipment",
      "Office furniture",
      "Storage units",
      "Outdoor furniture",
    ],
  },
]

const testimonials = [
  {
    name: "Robert Martinez",
    rating: 5,
    text: "Jake fixed three different issues in one visit - a squeaky door, loose cabinet handle, and mounted my new TV perfectly. Great value!",
    service: "Multiple Repairs",
    location: "Phoenix, AZ",
  },
  {
    name: "Lisa Thompson",
    rating: 5,
    text: "Needed help assembling a complex desk. The handyman arrived on time with all tools and had it done in 45 minutes. Professional and efficient!",
    service: "Furniture Assembly",
    location: "Portland, OR",
  },
  {
    name: "David Kim",
    rating: 5,
    text: "Excellent ceiling fan installation. Clean work, no mess left behind, and took time to explain the controls. Will definitely use again.",
    service: "Ceiling Fan Install",
    location: "Nashville, TN",
  },
]

const faqs = [
  {
    question: "Do handymen bring their own tools?",
    answer:
      "Yes! Our handymen come fully equipped with professional-grade tools and basic materials. For specialty items or specific parts, we'll coordinate with you beforehand.",
  },
  {
    question: "How do you price handyman services?",
    answer:
      "We charge by the hour with a 1-hour minimum. Most jobs are quoted upfront based on the work description. No hidden fees - you'll know the cost before we start.",
  },
  {
    question: "Can one handyman handle multiple tasks?",
    answer:
      "Our handymen are skilled in multiple areas and can tackle several small jobs in one visit, making it more cost-effective for you.",
  },
  {
    question: "Are your handymen licensed and insured?",
    answer:
      "Yes, all our handymen are licensed professionals with comprehensive insurance coverage. We also conduct thorough background checks for your peace of mind.",
  },
  {
    question: "What if the job takes longer than expected?",
    answer:
      "We provide upfront estimates and will communicate if a job requires more time. You'll always be informed and approve any additional work before we proceed.",
  },
]

export default function HandymanService() {
  return (
    <div className="min-h-screen">
      <ServiceHero
        title="Expert Handyman Services"
        highlightWord="Handyman"
        description="From small repairs to home improvements, our skilled handymen handle it all. Quality workmanship, reliable service, and no job too small."
        rating={4.8}
        reviewCount={2800}
        price="$75/hr"
        phoneNumber="(555) HANDY"
        isEmergency={false}
        imageSrc="/images/services/Professional Handyman.png"
        imageAlt="Professional handyman working on home repair"
      />

      {/* Service Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Handyman Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From small repairs to major installations, we handle all your home maintenance needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {handymanServices.map((category, index) => (
              <Card key={index} className={`relative ${category.popular ? "ring-2 ring-orange-500 shadow-lg" : ""}`}>
                {category.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{category.category}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-orange-600">{category.price}</CardDescription>
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

                  <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                    <Link
                      href={`/book-now?service=handyman&category=${category.category.toLowerCase().replace(/\s+/g, "-")}`}
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

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Handyman Service Works</h2>
            <p className="text-xl text-gray-600">Professional repairs and installations made simple</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Describe Your Job",
                description: "Tell us what needs to be fixed, installed, or assembled",
                icon: Wrench,
              },
              {
                step: "2",
                title: "Get Matched",
                description: "We connect you with a skilled handyman in your area",
                icon: Users,
              },
              {
                step: "3",
                title: "Expert Work",
                description: "Licensed professional completes your job with quality tools",
                icon: Hammer,
              },
              {
                step: "4",
                title: "Job Complete",
                description: "Enjoy your fixed or newly installed items with our warranty",
                icon: Home,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <step.icon className="w-8 h-8 text-orange-600 mx-auto mb-4" />
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
            <p className="text-xl text-gray-600">Real reviews from satisfied homeowners</p>
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
            <p className="text-xl text-gray-600">Everything you need to know about our handyman services</p>
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
      <section className="py-20 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Fix That To-Do List?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let our skilled handymen handle your repairs and installations professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
              <Link href="/book-now?service=handyman">
                Book Your Handyman Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600"
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
