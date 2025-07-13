"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight, Calculator, Clock, Shield } from "lucide-react"
import Link from "next/link"

const pricingTiers = [
  {
    name: "One-Time Cleaning",
    description: "Perfect for occasional deep cleans or trying our service",
    frequency: "As needed",
    discount: 0,
    prices: {
      small: { base: 149, final: 149 },
      medium: { base: 199, final: 199 },
      large: { base: 299, final: 299 },
    },
    features: [
      "All rooms thoroughly cleaned",
      "Kitchen & bathroom deep clean",
      "Dusting all surfaces",
      "Vacuuming & mopping",
      "Eco-friendly products",
      "All supplies included",
      "Satisfaction guarantee",
    ],
    popular: false,
    cta: "Book One-Time Cleaning",
    href: "/book-now?type=one-time",
  },
  {
    name: "Monthly Cleaning",
    description: "Regular monthly service to maintain your home",
    frequency: "Every 4 weeks",
    discount: 20,
    prices: {
      small: { base: 149, final: 119 },
      medium: { base: 199, final: 159 },
      large: { base: 299, final: 239 },
    },
    features: [
      "Everything in one-time cleaning",
      "Priority scheduling",
      "Consistent cleaning team",
      "20% monthly savings",
      "Easy online management",
      "Pause or cancel anytime",
      "Flexible rescheduling",
    ],
    popular: false,
    cta: "Start Monthly Service",
    href: "/book-now?type=monthly",
  },
  {
    name: "Bi-Weekly Cleaning",
    description: "Every two weeks for a consistently clean home",
    frequency: "Every 2 weeks",
    discount: 27,
    prices: {
      small: { base: 149, final: 109 },
      medium: { base: 199, final: 145 },
      large: { base: 299, final: 218 },
    },
    features: [
      "Everything in monthly plan",
      "Bi-weekly consistency",
      "27% total savings",
      "Premium customer support",
      "Same cleaning team",
      "Holiday coverage available",
      "Quality guarantee",
    ],
    popular: true,
    cta: "Start Bi-Weekly Service",
    href: "/book-now?type=biweekly",
  },
  {
    name: "Weekly Cleaning",
    description: "Ultimate convenience with maximum savings",
    frequency: "Every week",
    discount: 33,
    prices: {
      small: { base: 149, final: 100 },
      medium: { base: 199, final: 133 },
      large: { base: 299, final: 200 },
    },
    features: [
      "Everything in bi-weekly plan",
      "Weekly pristine home",
      "33% maximum savings",
      "VIP customer status",
      "Same-day rescheduling",
      "Holiday & vacation holds",
      "Complimentary touch-ups",
      "Priority customer support",
    ],
    popular: false,
    cta: "Start Weekly Service",
    href: "/book-now?type=weekly",
  },
]

const homeSizes = [
  {
    size: "Small Home",
    bedrooms: "1-2 bedrooms",
    bathrooms: "1 bathroom",
    sqft: "Up to 1,000 sq ft",
    description: "Apartments, condos, small houses",
    icon: "🏠",
  },
  {
    size: "Medium Home",
    bedrooms: "2-3 bedrooms",
    bathrooms: "2 bathrooms",
    sqft: "1,000-2,000 sq ft",
    description: "Townhouses, medium houses",
    icon: "🏡",
  },
  {
    size: "Large Home",
    bedrooms: "3+ bedrooms",
    bathrooms: "2+ bathrooms",
    sqft: "2,000+ sq ft",
    description: "Large houses, multi-level homes",
    icon: "🏘️",
  },
]

const addOnServices = [
  { name: "Deep Cleaning", price: 50, description: "First-time or seasonal deep clean" },
  { name: "Move In/Out Cleaning", price: 75, description: "Complete move-in or move-out cleaning" },
  { name: "Inside Oven Cleaning", price: 25, description: "Deep cleaning inside oven" },
  { name: "Inside Refrigerator", price: 25, description: "Complete refrigerator cleaning" },
  { name: "Inside Windows", price: 35, description: "Interior window cleaning" },
  { name: "Garage Cleaning", price: 40, description: "Basic garage organization and cleaning" },
]

export function PricingOverview() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900">House Cleaning Pricing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent, fixed pricing with no hidden fees. Save more with regular service subscriptions.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Satisfaction Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">Same-Day Available</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-800">Fixed Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Home Size Guide */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Home Size</h2>
            <p className="text-gray-600">Select the size that best matches your home for accurate pricing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {homeSizes.map((home, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-2">{home.icon}</div>
                  <CardTitle className="text-xl">{home.size}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div>{home.bedrooms}</div>
                    <div>{home.bathrooms}</div>
                    <div className="font-medium">{home.sqft}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{home.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Plans & Pricing</h2>
            <p className="text-gray-600">Save more with regular cleaning subscriptions</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.popular
                    ? "border-2 border-blue-500 shadow-xl transform scale-105"
                    : "border border-gray-200 hover:shadow-lg transition-shadow"
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription className="min-h-[3rem]">{tier.description}</CardDescription>
                  <div className="text-sm text-gray-600">{tier.frequency}</div>
                  {tier.discount > 0 && (
                    <Badge className="bg-green-100 text-green-800 mx-auto w-fit">Save {tier.discount}%</Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing Table */}
                  <div className="space-y-3">
                    {Object.entries(tier.prices).map(([size, pricing]) => (
                      <div key={size} className="flex justify-between items-center">
                        <span className="text-sm capitalize font-medium">{size}:</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${pricing.final}</div>
                          {pricing.base !== pricing.final && (
                            <div className="text-xs text-gray-500 line-through">${pricing.base}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
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
                        tier.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                      asChild
                    >
                      <Link href={tier.href} className="flex items-center justify-center">
                        <span className="truncate">{tier.cta}</span>
                        <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Add-On Services</h2>
            <p className="text-gray-600">Customize your cleaning with these optional extras</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOnServices.map((addon, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{addon.name}</h3>
                    <div className="text-xl font-bold text-green-600">+${addon.price}</div>
                  </div>
                  <p className="text-sm text-gray-600">{addon.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing Questions</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do you determine home size?</h3>
                <p className="text-gray-600">
                  We base pricing on the number of bedrooms and bathrooms, plus total square footage. Our booking system
                  will help you select the right size category.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I change my subscription plan?</h3>
                <p className="text-gray-600">
                  Yes! You can upgrade, downgrade, pause, or cancel your subscription anytime through your online
                  account or by contacting us.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Are there any hidden fees?</h3>
                <p className="text-gray-600">
                  No hidden fees! Our pricing includes all supplies, equipment, and labor. Add-on services are clearly
                  priced and optional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your first cleaning today and experience the Tapstead difference. Satisfaction guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 min-w-[200px]" asChild>
              <Link href="/book-now">
                Book Your Cleaning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 min-w-[160px] bg-transparent"
              asChild
            >
              <Link href="/contact">Have Questions?</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
