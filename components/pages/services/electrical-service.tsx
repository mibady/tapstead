"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServiceHero } from "@/components/shared/service-hero"
import { CheckCircle, Shield, Zap, AlertTriangle, ArrowRight, Star, Home, Clock, Phone } from "lucide-react"
import Link from "next/link"

const electricalServices = [
  {
    category: "Residential Electrical",
    price: "Starting at $99/hr",
    services: [
      "Lighting installation & repair",
      "Outlet & switch installation",
      "Circuit breaker repairs",
      "Ceiling fan installation",
      "Electrical panel upgrades",
      "Whole-house rewiring",
    ],
  },
  {
    category: "Emergency Electrical",
    price: "Starting at $149/hr",
    popular: true,
    emergency: true,
    services: [
      "Power outage diagnosis",
      "Spark or burning smell",
      "Tripping breakers",
      "Hot outlets or switches",
      "Buzzing sounds from panel",
      "24/7 emergency service",
    ],
  },
  {
    category: "Commercial Electrical",
    price: "Starting at $125/hr",
    services: [
      "Office lighting upgrades",
      "Data/network cabling",
      "Generator installation",
      "Electrical code compliance",
      "Energy efficiency audits",
      "EV charging stations",
    ],
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "Quick response to our emergency electrical issue. The electrician was professional, explained everything clearly, and fixed the problem safely. Highly recommend!",
    service: "Emergency Repair",
    location: "Bellevue, WA",
  },
  {
    name: "Michael Chen",
    rating: 5,
    text: "Installed new lighting throughout our home. The team was efficient, clean, and did an amazing job. The difference is night and day!",
    service: "Lighting Installation",
    location: "Redmond, WA",
  },
  {
    name: "Emily Rodriguez",
    rating: 5,
    text: "Upgraded our electrical panel to support our growing business needs. Professional, on time, and reasonably priced. Will use again for all our electrical work.",
    service: "Panel Upgrade",
    location: "Kirkland, WA"
  },
]

const faqs = [
  {
    question: "Are your electricians licensed and insured?",
    answer:
      "Yes, all our electricians are fully licensed, bonded, and insured. We only employ certified professionals who meet our high standards for safety and quality workmanship.",
  },
  {
    question: "Do you offer 24/7 emergency service?",
    answer:
      "Yes, we provide 24/7 emergency electrical services for urgent situations like power outages, electrical fires, or other dangerous conditions that require immediate attention.",
  },
  {
    question: "How do you price your electrical services?",
    answer:
      "Our pricing is based on the scope of work, materials needed, and time required. We provide transparent, upfront pricing with no hidden fees. Emergency services have a higher rate due to immediate response requirements.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve residential and commercial clients throughout the metropolitan area. Contact us to confirm if we cover your location.",
  },
  {
    question: "Do you provide warranties on your work?",
    answer:
      "Yes, we offer a 1-year labor warranty on all our electrical work. We also honor manufacturer warranties on any parts or materials we install.",
  },
]

export default function ElectricalService() {
  return (
    <div className="min-h-screen">
      <ServiceHero
        title="Professional Electrical Services"
        highlightWord="Electrical"
        description="From emergency repairs to complete rewiring, our licensed electricians provide safe, reliable electrical services for homes and businesses. 24/7 emergency service available."
        rating={4.9}
        reviewCount={3500}
        price="$99/hr"
        phoneNumber="(360) 641-7386"
        isEmergency={true}
        imageSrc="/images/services/Professional Electrical.png"
        imageAlt="Licensed electrician working on electrical panel"
      />

      {/* Service Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Electrical Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive electrical solutions for residential and commercial properties
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {electricalServices.map((service, index) => (
              <Card
                key={index}
                className={`relative ${
                  service.popular ? "ring-2 ring-primary shadow-lg" : ""
                } ${service.emergency ? "border-destructive/30" : ""}`}
              >
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                {service.emergency && (
                  <Badge variant="destructive" className="absolute -top-3 right-4">
                    Emergency
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{service.category}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary">
                    {service.price}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="flex items-center text-foreground">
                        <Zap className="w-4 h-4 text-yellow-500 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" asChild>
                    <Link href="/book-now?service=electrical">
                      Book {service.category}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 bg-destructive/10 text-destructive rounded-full">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Electrical Safety First</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why Choose Licensed Electricians
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Electrical work can be dangerous when not performed correctly. Our licensed electricians ensure your
              safety and compliance with all local electrical codes.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                {
                  title: "Certified Professionals",
                  description: "All our electricians are licensed and continuously trained on the latest safety standards and technologies.",
                  icon: <Shield className="w-8 h-8 text-primary mb-4" />,
                },
                {
                  title: "Code Compliance",
                  description: "We ensure all work meets or exceeds local electrical codes and passes required inspections.",
                  icon: <CheckCircle className="w-8 h-8 text-primary mb-4" />,
                },
                {
                  title: "Peace of Mind",
                  description: "With our warranty and insurance coverage, you can trust that the job is done right.",
                  icon: <Star className="w-8 h-8 text-primary mb-4" />,
                },
              ].map((item, index) => (
                <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground">Hear from homeowners and businesses we've helped</p>
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
                  <p className="text-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our electrical services
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-muted-foreground/20">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Need an Electrician Today?</h2>
          <p className="text-xl mb-8 opacity-90">
            Schedule service or request emergency electrical assistance 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link href="/book-now?service=electrical">
                Schedule Service
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-background text-background hover:bg-background/10"
              asChild
            >
              <a href="tel:13606417386">
                <Phone className="mr-2 h-5 w-5" />
                Call Now: (360) 641-7386
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
