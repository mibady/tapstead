"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, AlertTriangle, Shield, CheckCircle, Phone, Clock, HardHat, Home, Star } from "lucide-react"
import Link from "next/link"

export default function FireDebrisRemovalService() {
  const [selectedPackage, setSelectedPackage] = useState("emergency")

  const services = [
    {
      id: "emergency",
      name: "Emergency Response",
      icon: AlertTriangle,
      price: "From $499",
      description: "24/7 emergency fire debris removal and initial cleanup",
      features: [
        "Immediate emergency response",
        "Safety assessment and securing",
        "Hazardous material identification",
        "Initial debris removal",
        "Site stabilization",
        "Insurance documentation",
      ],
    },
    {
      id: "comprehensive",
      name: "Comprehensive Cleanup",
      icon: Home,
      price: "From $1,299",
      description: "Complete fire damage cleanup and debris removal",
      features: [
        "Complete debris removal",
        "Structural cleaning",
        "Smoke and soot removal",
        "Hazardous waste disposal",
        "Site preparation for restoration",
        "Environmental remediation",
      ],
    },
    {
      id: "restoration",
      name: "Restoration Prep",
      icon: Shield,
      price: "From $899",
      description: "Site preparation for reconstruction and restoration",
      features: [
        "Detailed damage assessment",
        "Salvageable item recovery",
        "Foundation and structure prep",
        "Utility line protection",
        "Site clearing and grading",
        "Restoration contractor coordination",
      ],
    },
  ]

  const process = [
    {
      step: 1,
      title: "Emergency Assessment",
      description: "Immediate safety evaluation and hazard identification",
    },
    {
      step: 2,
      title: "Debris Removal",
      description: "Safe removal of fire debris and damaged materials",
    },
    {
      step: 3,
      title: "Site Cleaning",
      description: "Thorough cleaning and decontamination of affected areas",
    },
    {
      step: 4,
      title: "Final Preparation",
      description: "Site preparation for restoration and reconstruction",
    },
  ]

  const testimonials = [
    {
      name: "Patricia Davis",
      rating: 5,
      comment:
        "After our house fire, they responded immediately and handled everything professionally. The cleanup was thorough and they worked with our insurance company seamlessly.",
      service: "Emergency Response",
    },
    {
      name: "Michael Thompson",
      rating: 5,
      comment:
        "Exceptional service during a very difficult time. They were compassionate, professional, and got our property ready for rebuilding quickly.",
      service: "Comprehensive Cleanup",
    },
    {
      name: "Linda Rodriguez",
      rating: 5,
      comment:
        "The team was incredibly thorough and careful with salvaging what could be saved. Their expertise made the restoration process much smoother.",
      service: "Restoration Prep",
    },
  ]

  const faqs = [
    {
      question: "How quickly can you respond to a fire emergency?",
      answer:
        "We provide 24/7 emergency response and can typically be on-site within 2-4 hours of your call, depending on location and current emergency load.",
    },
    {
      question: "Do you work with insurance companies?",
      answer:
        "Yes, we work directly with insurance companies and can help document damage, provide detailed reports, and coordinate with adjusters to streamline your claim process.",
    },
    {
      question: "What safety precautions do you take?",
      answer:
        "Our certified technicians use full protective equipment, follow OSHA safety protocols, and conduct thorough safety assessments before beginning any cleanup work.",
    },
    {
      question: "Can you help salvage personal belongings?",
      answer:
        "Yes, we carefully assess and attempt to salvage personal belongings, furniture, and valuables that may be recoverable through professional cleaning and restoration techniques.",
    },
    {
      question: "How do you handle hazardous materials?",
      answer:
        "We are certified in hazardous material handling and disposal. All contaminated materials are properly identified, contained, and disposed of according to EPA regulations.",
    },
    {
      question: "What areas do you service for fire cleanup?",
      answer:
        "We provide fire debris removal services throughout the metropolitan area with emergency response capabilities. Contact us to confirm service availability in your location.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <Flame className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Emergency <span className="text-red-600">Fire Debris Removal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional fire damage cleanup and debris removal services. 24/7 emergency response by certified
              specialists for safe, thorough restoration preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/book-now?service=fire-debris-removal">Emergency Cleanup</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <Phone className="mr-2 h-5 w-5" />
                24/7 Emergency: (555) 911-FIRE
              </Button>
            </div>
            <div className="flex justify-center items-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>24/7 Emergency Response</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Certified Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <HardHat className="h-5 w-5 text-yellow-600" />
                <span>OSHA Safety Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fire Cleanup Services</h2>
            <p className="text-lg text-gray-600">Professional fire damage restoration and debris removal</p>
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
                        <service.icon className="h-8 w-8 text-red-600" />
                        <div>
                          <CardTitle className="text-2xl">{service.name}</CardTitle>
                          <CardDescription className="text-lg">{service.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">{service.price}</div>
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
                        <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                          <Link href={`/book-now?service=fire-debris-removal&package=${service.id}`}>
                            Book {service.name}
                          </Link>
                        </Button>
                        <div className="text-center text-sm text-gray-600">
                          <p>✓ 24/7 emergency response</p>
                          <p>✓ Insurance coordination</p>
                          <p>✓ Certified specialists</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Fire Cleanup Process</h2>
            <p className="text-lg text-gray-600">Professional fire damage restoration from emergency to recovery</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
            <p className="text-lg text-gray-600">Real experiences from families we've helped recover</p>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our fire cleanup services</p>
          </div>

          <div className="space-y-6">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Emergency Fire Cleanup?</h2>
          <p className="text-xl text-red-100 mb-8">
            Don't wait - fire damage gets worse over time. Our certified specialists are standing by 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100" asChild>
              <Link href="/book-now?service=fire-debris-removal">Book Emergency Service</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-red-700">
              <Phone className="mr-2 h-5 w-5" />
              Call Now: (555) 911-FIRE
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
