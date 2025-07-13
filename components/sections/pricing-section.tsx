"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

const pricingPlans = [
  {
    name: "One-Time Cleaning",
    description: "Perfect for occasional deep cleans",
    prices: {
      small: 149,
      medium: 199,
      large: 299,
    },
    features: [
      "All rooms thoroughly cleaned",
      "Kitchen & bathroom deep clean",
      "Eco-friendly products",
      "All supplies included",
      "Satisfaction guarantee",
    ],
    popular: false,
    cta: "Book One-Time",
    href: "/book-now?type=one-time",
  },
  {
    name: "Monthly Cleaning",
    description: "Regular monthly service with 20% savings",
    prices: {
      small: 119, // 20% off
      medium: 159,
      large: 239,
    },
    originalPrices: {
      small: 149,
      medium: 199,
      large: 299,
    },
    savings: "20%",
    features: [
      "Everything in one-time cleaning",
      "Priority scheduling",
      "Consistent cleaning team",
      "20% monthly savings",
      "Easy online management",
      "Pause anytime",
    ],
    popular: false,
    cta: "Start Monthly",
    href: "/book-now?type=monthly",
  },
  {
    name: "Bi-Weekly Cleaning",
    description: "Every two weeks with 27% savings",
    prices: {
      small: 109, // 27% off
      medium: 145,
      large: 218,
    },
    originalPrices: {
      small: 149,
      medium: 199,
      large: 299,
    },
    savings: "27%",
    features: [
      "Everything in monthly plan",
      "Bi-weekly consistency",
      "27% total savings",
      "Premium customer support",
      "Flexible rescheduling",
      "Holiday coverage",
    ],
    popular: true,
    cta: "Start Bi-Weekly",
    href: "/book-now?type=biweekly",
  },
  {
    name: "Weekly Cleaning",
    description: "Ultimate convenience with 33% savings",
    prices: {
      small: 100, // 33% off
      medium: 133,
      large: 200,
    },
    originalPrices: {
      small: 149,
      medium: 199,
      large: 299,
    },
    savings: "33%",
    features: [
      "Everything in bi-weekly plan",
      "Weekly pristine home",
      "33% maximum savings",
      "VIP customer status",
      "Same-day rescheduling",
      "Holiday & vacation holds",
      "Complimentary touch-ups",
    ],
    popular: false,
    cta: "Start Weekly",
    href: "/book-now?type=weekly",
  },
]

const homeSizes = [
  { size: "Small", description: "1-2 bedrooms, 1 bathroom", sqft: "Up to 1,000 sq ft" },
  { size: "Medium", description: "2-3 bedrooms, 2 bathrooms", sqft: "1,000-2,000 sq ft" },
  { size: "Large", description: "3+ bedrooms, 2+ bathrooms", sqft: "2,000+ sq ft" },
]

export function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fixed pricing for house cleaning with bigger savings for regular service. No hidden fees, no surprises.
          </p>
        </div>

        {/* Home Size Guide */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Choose Your Home Size</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {homeSizes.map((home, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{home.size} Home</CardTitle>
                  <CardDescription>{home.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">{home.sqft}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular ? "border-2 border-blue-500 shadow-xl scale-105" : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                {plan.savings && (
                  <Badge className="bg-green-100 text-green-800 mx-auto w-fit">Save {plan.savings}</Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="space-y-3">
                  {Object.entries(plan.prices).map(([size, price]) => (
                    <div key={size} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{size}:</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">${price}</div>
                        {plan.originalPrices && (
                          <div className="text-xs text-gray-500 line-through">
                            ${plan.originalPrices[size as keyof typeof plan.originalPrices]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="pt-4">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                    asChild
                  >
                    <Link href={plan.href} className="flex items-center justify-center">
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-gray-50 p-8 rounded-xl">
          <h3 className="text-2xl font-bold text-center mb-6">Add-On Services</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="font-semibold">Deep Cleaning</div>
              <div className="text-green-600 font-bold">+$50</div>
              <div className="text-sm text-gray-600">First-time or seasonal</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">Move In/Out</div>
              <div className="text-green-600 font-bold">+$75</div>
              <div className="text-sm text-gray-600">Complete move cleaning</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">Inside Oven</div>
              <div className="text-green-600 font-bold">+$25</div>
              <div className="text-sm text-gray-600">Deep oven cleaning</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">Inside Fridge</div>
              <div className="text-green-600 font-bold">+$25</div>
              <div className="text-sm text-gray-600">Complete fridge clean</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]" asChild>
            <Link href="/book-now">
              Get Started Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            Questions?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact us
            </Link>{" "}
            for help choosing the right plan.
          </p>
        </div>
      </div>
    </section>
  )
}
