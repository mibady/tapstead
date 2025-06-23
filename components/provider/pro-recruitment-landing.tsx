"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, Shield, Users, Star, CheckCircle, ArrowRight, Phone, Mail, Award } from "lucide-react"

export function ProRecruitmentLanding() {
  const [email, setEmail] = useState("")

  const benefits = [
    {
      icon: DollarSign,
      title: "Guaranteed Earnings",
      description: "Average $75-150/hour with instant payment upon job completion",
      highlight: "$75-150/hr",
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description: "Work when you want. Accept jobs that fit your schedule",
      highlight: "Your Schedule",
    },
    {
      icon: Shield,
      title: "Zero Marketing Hassle",
      description: "We handle all customer acquisition, booking, and billing",
      highlight: "We Handle It",
    },
    {
      icon: Users,
      title: "Steady Work Flow",
      description: "Join 500+ certified pros with consistent job opportunities",
      highlight: "500+ Pros",
    },
  ]

  const tiers = [
    {
      name: "Bronze Pro",
      earnings: "$75-95/hr",
      features: ["Standard job priority", "Weekly payments", "Basic support"],
      color: "border-orange-200 bg-orange-50",
    },
    {
      name: "Silver Pro",
      earnings: "$95-125/hr",
      features: ["Priority job access", "Bi-weekly payments", "Dedicated support", "Performance bonuses"],
      color: "border-gray-300 bg-gray-50",
      popular: true,
    },
    {
      name: "Gold Pro",
      earnings: "$125-150/hr",
      features: ["First job priority", "Daily payments", "Premium support", "Referral bonuses", "Exclusive projects"],
      color: "border-yellow-300 bg-yellow-50",
    },
  ]

  const testimonials = [
    {
      name: "Mike Rodriguez",
      trade: "Licensed Electrician",
      rating: 4.9,
      quote: "Tapstead changed my business. No more chasing leads or invoices. Just quality work and guaranteed pay.",
      earnings: "$8,500/month",
    },
    {
      name: "Sarah Chen",
      trade: "House Cleaning Pro",
      rating: 5.0,
      quote: "I love the flexibility and the customers are always pre-screened. Best decision I made for my business.",
      earnings: "$6,200/month",
    },
    {
      name: "David Thompson",
      trade: "Handyman Services",
      rating: 4.8,
      quote: "Military veteran here. Tapstead's support and steady work helped me build a successful business.",
      earnings: "$7,800/month",
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-6 text-lg px-4 py-2">Now Hiring Certified Professionals</Badge>
            <h1 className="text-5xl font-bold mb-6">
              Join the Elite Network of
              <span className="text-yellow-300"> Tapstead Certified Pros</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Stop chasing leads. Start earning guaranteed income with pre-booked, pre-paid jobs. We handle the
              customers, you handle the craft.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" asChild>
                <Link href="/become-pro/application">
                  Apply Now - It's Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call (555) PRO-JOBS
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">$125/hr</div>
                <div className="text-blue-200">Average Earnings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-blue-200">Certified Pros</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">4.9★</div>
                <div className="text-blue-200">Pro Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Top Professionals Choose Tapstead</h2>
            <p className="text-xl text-gray-600">We're not just another gig platform. We're your business partner.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {benefit.highlight}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Tiers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Performance-Based Earnings Tiers</h2>
            <p className="text-xl text-gray-600">The better you perform, the more you earn. It's that simple.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.color} ${tier.popular ? "ring-2 ring-blue-500" : ""}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-green-600">{tier.earnings}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories from Our Certified Pros</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm text-gray-600">{testimonial.trade}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{testimonial.rating}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 w-fit">{testimonial.earnings} avg/month</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Do You Qualify?</h2>
              <p className="text-xl text-gray-600">
                We maintain high standards to ensure quality for our customers and success for our pros.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Basic Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      2+ years professional experience
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      Clean background check
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      $1M+ liability insurance
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      Professional references
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      Reliable transportation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 text-yellow-500 mr-2" />
                    Preferred Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                      Professional licenses/certifications
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                      Military/veteran background
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                      Existing positive online reviews
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                      Business insurance
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                      Professional tools/equipment
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Elite Network?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Applications are reviewed within 48 hours. Start earning this week.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" asChild>
              <Link href="/become-pro/application">
                Start Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white bg-blue-700 hover:bg-white hover:text-blue-600">
              <Mail className="w-4 h-4 mr-2" />
              Email Questions
            </Button>
          </div>

          <div className="text-sm text-blue-200">Questions? Call our Pro Recruitment Team at (555) PRO-JOBS</div>
        </div>
      </section>
    </div>
  )
}
