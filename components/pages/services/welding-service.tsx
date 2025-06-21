"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Zap, Settings, Shield, CheckCircle, Star, Phone, Wrench, HardHat, Award } from "lucide-react"
import Link from "next/link"

export default function WeldingService() {
  const [selectedPackage, setSelectedPackage] = useState("repair")

  const services = [
    {
      id: "repair",
      name: "Welding Repairs",
      icon: Wrench,
      price: "From $149",
      description: "Professional welding repairs for metal structures and equipment",
      features: [
        "Structural steel repairs",
        "Gate and fence welding",
        "Equipment bracket repairs",
        "Metal furniture restoration",
        "Automotive welding repairs",
        "Emergency repair services",
      ],
    },
    {
      id: "fabrication",
      name: "Custom Fabrication",
      icon: Settings,
      price: "From $299",
      description: "Custom metal fabrication and manufacturing services",
      features: [
        "Custom railings and stairs",
        "Metal furniture creation",
        "Decorative metalwork",
        "Industrial equipment parts",
        "Architectural metalwork",
        "Prototype development",
      ],
    },
    {
      id: "installation",
      name: "Installation Services",
      icon: HardHat,
      price: "From $199",
      description: "Professional installation of welded structures and components",
      features: [
        "Railing installation",
        "Gate and fence installation",
        "Structural steel installation",
        "Equipment mounting",
        "Safety barrier installation",
        "Code compliance verification",
      ],
    },
  ]

  const process = [
    {
      step: 1,
      title: "Project Assessment",
      description: "Detailed evaluation of welding requirements and material specifications",
    },
    {
      step: 2,
      title: "Design & Planning",
      description: "Custom design development and project planning with material selection",
    },
    {
      step: 3,
      title: "Professional Welding",
      description: "Expert welding using certified techniques and professional equipment",
    },
    {
      step: 4,
      title: "Quality Inspection",
      description: "Thorough inspection and testing to ensure structural integrity",
    },
  ]

  const testimonials = [
    {
      name: "Robert Martinez",
      rating: 5,
      comment:
        "Outstanding welding work on our custom stair railing. The craftsmanship is exceptional and the installation was flawless. Highly recommend!",
      service: "Custom Fabrication",
    },
    {
      name: "Amanda Foster",
      rating: 5,
      comment:
        "Quick and professional repair of our broken gate. The welder was skilled, punctual, and the repair is stronger than the original.",
      service: "Welding Repairs",
    },
    {
      name: "James Wilson",
      rating: 5,
      comment:
        "Excellent work on our industrial equipment repairs. Professional service with attention to safety and quality standards.",
      service: "Installation Services",
    },
  ]

  const faqs = [
    {
      question: "Are your welders certified?",
      answer:
        "Yes, all our welders are AWS (American Welding Society) certified and have extensive experience in various welding techniques including MIG, TIG, and stick welding.",
    },
    {
      question: "What types of metals can you weld?",
      answer:
        "We work with all common metals including steel, stainless steel, aluminum, and cast iron. We can also work with specialty alloys for specific applications.",
    },
    {
      question: "Do you provide mobile welding services?",
      answer:
        "Yes, we offer mobile welding services and can bring our equipment to your location for on-site repairs and installations when needed.",
    },
    {
      question: "What safety measures do you follow?",
      answer:
        "We follow all OSHA safety standards and use proper ventilation, protective equipment, and fire safety measures. All work areas are properly secured during welding operations.",
    },
    {
      question: "Do you offer warranties on welding work?",
      answer:
        "Yes, we provide a 2-year warranty on all welding repairs and a 5-year warranty on custom fabrication work, ensuring structural integrity and quality.",
    },
    {
      question: "Can you work with architectural drawings?",
      answer:
        "Our team can work from architectural drawings, engineering specifications, or help develop custom designs based on your requirements.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-100 rounded-full">
                <Zap className="h-12 w-12 text-gray-700" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional <span className="text-gray-700">Welding Services</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Expert welding, metal fabrication, and repair services by certified welders. Custom metalwork and
              professional installations with guaranteed quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gray-700 hover:bg-gray-800" asChild>
                <Link href="/book-now?service=welding">Book Welding Service</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-700 text-gray-700 hover:bg-gray-50">
                <Phone className="mr-2 h-5 w-5" />
                Free Project Quote
              </Button>
            </div>
            <div className="flex justify-center items-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>AWS Certified Welders</span>
              </div>
              <div className="flex items-center gap-2">
                <HardHat className="h-5 w-5 text-blue-600" />
                <span>OSHA Safety Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span>5-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Welding Services</h2>
            <p className="text-lg text-gray-600">Professional metalwork for every application</p>
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
                        <service.icon className="h-8 w-8 text-gray-700" />
                        <div>
                          <CardTitle className="text-2xl">{service.name}</CardTitle>
                          <CardDescription className="text-lg">{service.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-700">{service.price}</div>
                        <div className="text-sm text-gray-500">Starting price</div>
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
                        <Button className="w-full bg-gray-700 hover:bg-gray-800" asChild>
                          <Link href={`/book-now?service=welding&package=${service.id}`}>Book {service.name}</Link>
                        </Button>
                        <div className="text-center text-sm text-gray-600">
                          <p>✓ Certified welders</p>
                          <p>✓ Professional equipment</p>
                          <p>✓ Quality guaranteed</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Welding Process Works</h2>
            <p className="text-lg text-gray-600">Professional metalwork from concept to completion</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
            <p className="text-lg text-gray-600">Trusted for quality metalwork and fabrication</p>
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
            <p className="text-lg text-gray-600">Everything you need to know about our welding services</p>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Professional Welding Services?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Certified welders ready to handle your metalwork projects with precision and quality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-700 hover:bg-gray-100" asChild>
              <Link href="/book-now?service=welding">Book Welding Service</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-gray-600">
              <Settings className="mr-2 h-5 w-5" />
              Get Custom Quote
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
