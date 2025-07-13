"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Shield, Star, Users, Sparkles, Home, Calendar, Phone, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function HouseCleaningService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Most Popular Service
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Professional House Cleaning Services
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the joy of coming home to a spotless house. Our trusted, insured cleaners use eco-friendly
                  products to deliver exceptional results every time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/book-now">
                    Book Cleaning Service
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/emergency">
                    <Phone className="mr-2 h-5 w-5" />
                    Call (360) 641-7386
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">2,500+ Happy Customers</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/services/house-cleaning-hero.png"
                alt="Professional house cleaning service"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Complete House Cleaning Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From regular maintenance to deep cleaning, we offer comprehensive services tailored to your home's needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Regular Cleaning",
                description: "Weekly, bi-weekly, or monthly cleaning to maintain your home's cleanliness",
                features: [
                  "Dusting all surfaces",
                  "Vacuuming carpets",
                  "Mopping floors",
                  "Bathroom sanitizing",
                  "Kitchen cleaning",
                ],
                price: "Starting at $120",
              },
              {
                title: "Deep Cleaning",
                description: "Comprehensive cleaning for spring cleaning or first-time service",
                features: [
                  "Inside appliances",
                  "Baseboards & trim",
                  "Light fixtures",
                  "Cabinet fronts",
                  "Window sills",
                ],
                price: "Starting at $200",
              },
              {
                title: "Move-In/Out Cleaning",
                description: "Thorough cleaning for moving transitions",
                features: [
                  "Empty home cleaning",
                  "Inside all cabinets",
                  "Appliance deep clean",
                  "Closet cleaning",
                  "Garage sweep",
                ],
                price: "Starting at $250",
              },
            ].map((service, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <p className="font-semibold text-blue-600">{service.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Tapstead for House Cleaning?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional cleaning services with transparency, reliability, and care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Insured & Bonded",
                description: "All cleaners are fully insured and background-checked for your peace of mind.",
              },
              {
                icon: Sparkles,
                title: "Eco-Friendly Products",
                description: "We use safe, non-toxic cleaning products that are gentle on your family and pets.",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description: "Book online 24/7 with same-day availability and flexible rescheduling options.",
              },
              {
                icon: Star,
                title: "Satisfaction Guaranteed",
                description: "Not happy with the service? We'll return within 24 hours to make it right.",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="pt-8 space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting your home professionally cleaned is simple with our streamlined process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Book Online",
                description:
                  "Choose your service type, select your preferred date and time, and provide your home details.",
                icon: Calendar,
              },
              {
                step: "2",
                title: "We Clean",
                description:
                  "Our professional cleaners arrive on time with all supplies and clean your home thoroughly.",
                icon: Home,
              },
              {
                step: "3",
                title: "Enjoy Your Clean Home",
                description: "Relax and enjoy your spotless home. Rate your service and schedule your next cleaning.",
                icon: Star,
              },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  {step.step}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees or surprise charges. Our pricing is based on your home size and cleaning frequency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                size: "1-2 Bedrooms",
                area: "Up to 1,000 sq ft",
                weekly: "$120",
                biweekly: "$140",
                monthly: "$160",
                popular: false,
              },
              {
                size: "3-4 Bedrooms",
                area: "1,000 - 2,000 sq ft",
                weekly: "$160",
                biweekly: "$180",
                monthly: "$200",
                popular: true,
              },
              {
                size: "5+ Bedrooms",
                area: "2,000+ sq ft",
                weekly: "$200",
                biweekly: "$220",
                monthly: "$250",
                popular: false,
              },
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "ring-2 ring-blue-600" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.size}</CardTitle>
                  <CardDescription>{plan.area}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Weekly</span>
                      <span className="font-semibold">{plan.weekly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bi-weekly</span>
                      <span className="font-semibold">{plan.biweekly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly</span>
                      <span className="font-semibold">{plan.monthly}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                    <Link href="/book-now">Select Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All prices include supplies and equipment. Deep cleaning available for additional fee.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "Bellevue, WA",
                rating: 5,
                text: "Tapstead has been a game-changer for our family. The cleaners are thorough, reliable, and always professional. Our house has never looked better!",
              },
              {
                name: "Mike Chen",
                location: "Seattle, WA",
                rating: 5,
                text: "I love the transparent pricing and easy online booking. The cleaning team does an amazing job every time, and I can trust them completely in my home.",
              },
              {
                name: "Jennifer Martinez",
                location: "Tacoma, WA",
                rating: 5,
                text: "The eco-friendly products were important to us with young kids. Tapstead delivers exceptional cleaning while keeping our family safe.",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our house cleaning services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Do I need to be home during the cleaning?",
                answer:
                  "No, you don't need to be home. Many of our customers provide access instructions and go about their day while we clean. All our cleaners are background-checked and insured.",
              },
              {
                question: "What cleaning supplies do you use?",
                answer:
                  "We bring all necessary cleaning supplies and equipment. We use eco-friendly, non-toxic products that are safe for your family and pets. If you have specific product preferences, just let us know.",
              },
              {
                question: "How long does a typical cleaning take?",
                answer:
                  "Cleaning time varies by home size and service type. A regular cleaning typically takes 1-3 hours, while deep cleaning can take 3-5 hours. We'll provide an estimated time when you book.",
              },
              {
                question: "What if I'm not satisfied with the cleaning?",
                answer:
                  "We guarantee your satisfaction. If you're not happy with any aspect of the cleaning, contact us within 24 hours and we'll return to address any concerns at no additional charge.",
              },
              {
                question: "Can I customize my cleaning service?",
                answer:
                  "We offer customizable cleaning plans. You can add specific tasks, skip certain areas, or request special attention to particular rooms. Just let us know your preferences when booking.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready for a Spotless Home?</h2>
            <p className="text-xl text-blue-100">
              Join thousands of satisfied customers who trust Tapstead for their house cleaning needs. Book your
              cleaning service today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/book-now">
                  Book Cleaning Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Link href="/emergency">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (360) 641-7386
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
