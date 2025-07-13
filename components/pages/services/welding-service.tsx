"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Phone, Shield, Star, Zap, Wrench, HardHat } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function WeldingService() {
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
      icon: HardHat,
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
      icon: Shield,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-600 text-white">Professional Welding Services</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Expert Welding & Metal Fabrication Services
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professional welding, custom metal fabrication, and repair services by certified welders. Quality
                craftsmanship with guaranteed results for residential and commercial projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/book-now?service=welding">Book Welding Service</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="tel:3606417386">
                    <Phone className="mr-2 h-4 w-4" />
                    (360) 641-7386
                  </Link>
                </Button>
              </div>
              <div className="flex items-center mt-6 space-x-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-gray-600">4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-600">AWS Certified</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/services/welding-services-hero.png"
                alt="Professional welding service"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Welding Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional metalwork for every application, from repairs to custom fabrication
            </p>
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
                        <service.icon className="h-8 w-8 text-blue-600" />
                        <div>
                          <CardTitle className="text-2xl">{service.name}</CardTitle>
                          <CardDescription className="text-lg">{service.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{service.price}</div>
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
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Welding Process</h2>
            <p className="text-xl text-gray-600">Professional metalwork from concept to completion</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Welding Services?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AWS Certified</h3>
              <p className="text-gray-600">
                All welders are certified by the American Welding Society with proven expertise
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <HardHat className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">OSHA compliant safety practices and proper protective equipment</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Equipment</h3>
              <p className="text-gray-600">State-of-the-art welding equipment for precision and quality</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">5-year warranty on fabrication work and 2-year warranty on repairs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from satisfied customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our welding services</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Professional Welding Services?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get expert welding and metal fabrication services from certified professionals. Quality work with guaranteed
            results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/book-now?service=welding">Get Free Quote</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="tel:3606417386">
                <Phone className="mr-2 h-4 w-4" />
                Call (360) 641-7386
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WeldingService
