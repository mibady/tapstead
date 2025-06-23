"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Paintbrush, Home, Palette, CheckCircle, Star, Phone, Shield, Award, Droplets, Sun } from "lucide-react"
import Link from "next/link"

export default function PaintingService() {
  const [selectedPackage, setSelectedPackage] = useState("interior")

  const services = [
    {
      id: "interior",
      name: "Interior Painting",
      icon: Home,
      price: "From $299",
      description: "Transform your indoor spaces with professional interior painting",
      features: [
        "Room preparation and protection",
        "Premium paint and primer",
        "Wall repair and patching",
        "Trim and ceiling painting",
        "Color consultation included",
        "Complete cleanup service",
      ],
    },
    {
      id: "exterior",
      name: "Exterior Painting",
      icon: Sun,
      price: "From $899",
      description: "Protect and beautify your home's exterior",
      features: [
        "Power washing preparation",
        "Weather-resistant paints",
        "Siding and trim painting",
        "Window and door painting",
        "Deck and fence staining",
        "10-year paint warranty",
      ],
    },
    {
      id: "specialty",
      name: "Specialty Painting",
      icon: Palette,
      price: "From $199",
      description: "Custom painting techniques and specialty finishes",
      features: [
        "Accent walls and features",
        "Textured paint finishes",
        "Cabinet painting/refinishing",
        "Decorative painting techniques",
        "Color matching services",
        "Touch-up and maintenance",
      ],
    },
  ]

  const process = [
    {
      step: 1,
      title: "Color Consultation",
      description: "Professional color consultation and paint selection guidance",
    },
    {
      step: 2,
      title: "Surface Preparation",
      description: "Thorough cleaning, patching, and priming of all surfaces",
    },
    {
      step: 3,
      title: "Professional Painting",
      description: "Expert application using premium paints and techniques",
    },
    {
      step: 4,
      title: "Final Inspection",
      description: "Quality check and touch-ups to ensure perfect results",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Absolutely beautiful work! The painters were professional, clean, and the results exceeded our expectations. Our living room looks amazing!",
      service: "Interior Painting",
    },
    {
      name: "Mark Williams",
      rating: 5,
      comment:
        "Outstanding exterior painting job. They power washed, prepped everything perfectly, and the paint job looks flawless. Great value!",
      service: "Exterior Painting",
    },
    {
      name: "Lisa Chen",
      rating: 5,
      comment:
        "The specialty finish on our accent wall is stunning. The painters were true artists and really brought our vision to life.",
      service: "Specialty Painting",
    },
  ]

  const faqs = [
    {
      question: "What type of paint do you use?",
      answer:
        "We use premium paints from top brands like Sherwin-Williams and Benjamin Moore. All paints are low-VOC and environmentally friendly, with excellent durability and coverage.",
    },
    {
      question: "How long does a typical painting project take?",
      answer:
        "Interior rooms typically take 1-3 days, while exterior painting can take 3-7 days depending on home size and weather conditions. We provide detailed timelines during consultation.",
    },
    {
      question: "Do you provide color consultation services?",
      answer:
        "Yes! Our professional color consultants help you choose the perfect colors for your space, considering lighting, décor, and your personal style preferences.",
    },
    {
      question: "What preparation work is included?",
      answer:
        "All necessary prep work is included: surface cleaning, patching holes, caulking gaps, priming, and protecting furniture and floors with drop cloths and plastic.",
    },
    {
      question: "Do you offer warranties on your painting work?",
      answer:
        "Yes, we provide a 2-year warranty on interior painting and up to 10 years on exterior painting, depending on the paint system used.",
    },
    {
      question: "Can you paint in cold weather?",
      answer:
        "We can paint in temperatures as low as 35°F using special cold-weather paints. However, we may recommend waiting for optimal conditions for best results.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Image */}
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/services/Professional Painting.png"
                alt="Professional Painting Services"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent lg:hidden"></div>
              <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-md">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-1 font-semibold text-sm">4.9/5</span>
                  <span className="text-xs text-gray-600">(2,800+ jobs)</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-100 text-orange-800 rounded-full">
                <Paintbrush className="h-5 w-5" />
                <span className="font-medium">Transforming Homes Since 2015</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Expert <span className="text-orange-600">Painting</span> Services
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl lg:max-w-none mx-auto lg:mx-0">
                Transform your home with expert interior and exterior painting. Premium paints, professional techniques,
                and beautiful results guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                  <Link href="/book-now?service=painting">
                    <Paintbrush className="mr-2 h-5 w-5" />
                    Book Painting Service
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  <Phone className="mr-2 h-5 w-5" />
                  Free Color Consultation
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm text-gray-600">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Droplets className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Premium Paints</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Award className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <span>10-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Painting Services</h2>
            <p className="text-lg text-gray-600">Professional painting for every part of your home</p>
          </div>

          <Tabs value={selectedPackage} onValueChange={setSelectedPackage} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {services.map((service) => (
                <TabsTrigger key={service.id} value={service.id} className="flex items-center gap-2">
                  <service.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{service.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {services.map((service) => (
              <TabsContent key={service.id} value={service.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <service.icon className="h-8 w-8 text-orange-600" />
                        <div>
                          <CardTitle className="text-2xl">{service.name}</CardTitle>
                          <CardDescription className="text-lg">{service.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-orange-600">{service.price}</div>
                        <div className="text-sm text-gray-500">Per room/area</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          What's Included
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                          <Link href={`/book-now?service=painting&package=${service.id}`}>Book {service.name}</Link>
                        </Button>
                        <div className="text-center text-sm text-gray-600">
                          <p>✓ Premium paint included</p>
                          <p>✓ Professional preparation</p>
                          <p>✓ Complete cleanup</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Painting Process Works</h2>
            <p className="text-lg text-gray-600">Professional results through proven techniques</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Trusted for beautiful, lasting paint jobs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.service}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our painting services</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Home?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Professional painters ready to bring your vision to life with beautiful, lasting results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
              <Link href="/book-now?service=painting">Book Painting Service</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-700">
              <Palette className="mr-2 h-5 w-5" />
              Free Color Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
