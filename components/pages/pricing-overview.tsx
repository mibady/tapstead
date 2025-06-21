import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight, DollarSign, Clock, Shield } from "lucide-react"
import Link from "next/link"

const servicesPricing = [
  {
    category: "Cleaning Services",
    services: [
      { name: "House Cleaning (1-2 BR)", price: "$99-129", duration: "2-3 hours" },
      { name: "House Cleaning (3-4 BR)", price: "$149-199", duration: "3-4 hours" },
      { name: "Deep Cleaning", price: "$199-299", duration: "4-6 hours" },
      { name: "Move-in/out Cleaning", price: "$249-349", duration: "4-8 hours" },
      { name: "Pressure Washing", price: "$199-399", duration: "2-4 hours" },
    ],
  },
  {
    category: "Handyman & Repairs",
    services: [
      { name: "Handyman Services", price: "$75/hr", duration: "1-3 hours" },
      { name: "Furniture Assembly", price: "$89-149", duration: "1-2 hours" },
      { name: "TV Mounting", price: "$129-199", duration: "1-2 hours" },
      { name: "Shelf Installation", price: "$99-179", duration: "1-2 hours" },
      { name: "Minor Repairs", price: "$89-149", duration: "1-2 hours" },
    ],
  },
  {
    category: "Plumbing & Electrical",
    services: [
      { name: "Plumbing Services", price: "$89/hr", duration: "1-3 hours" },
      { name: "Electrical Services", price: "$125/hr", duration: "1-3 hours" },
      { name: "Drain Cleaning", price: "$149-249", duration: "1-2 hours" },
      { name: "Outlet Installation", price: "$129-199", duration: "1-2 hours" },
      { name: "Emergency Service", price: "+50%", duration: "Same day" },
    ],
  },
  {
    category: "Exterior & Specialized",
    services: [
      { name: "Gutter Cleaning", price: "$159-299", duration: "2-4 hours" },
      { name: "Gutter Repairs", price: "$199-399", duration: "2-3 hours" },
      { name: "Welding Services", price: "$95/hr", duration: "1-4 hours" },
      { name: "Interior Painting", price: "$299-799", duration: "4-8 hours" },
      { name: "Junk Removal", price: "$149-399", duration: "1-2 hours" },
    ],
  },
  {
    category: "Emergency Services",
    services: [
      { name: "Fire Debris Removal", price: "$299-999", duration: "4-8 hours" },
      { name: "Storm Damage Cleanup", price: "$249-799", duration: "3-6 hours" },
      { name: "Emergency Response", price: "$199-599", duration: "2-6 hours" },
      { name: "24/7 Emergency Call", price: "+$75", duration: "Immediate" },
    ],
  },
]

const subscriptionPlans = [
  {
    name: "Pay-As-You-Go",
    price: "$0",
    period: "No monthly fee",
    description: "Perfect for occasional home maintenance needs",
    features: [
      "Transparent upfront pricing",
      "Same-day booking available",
      "100% satisfaction guarantee",
      "Insured professionals",
      "24/7 customer support",
    ],
    discount: 0,
    popular: false,
    cta: "Book a Service",
  },
  {
    name: "Home Care Plus",
    price: "$49",
    period: "/month",
    originalPrice: "$89",
    description: "Best value for regular home maintenance",
    features: [
      "Everything in Pay-As-You-Go",
      "15% discount on all services",
      "Priority scheduling",
      "Quarterly maintenance reminders",
      "Free service consultations",
      "Dedicated account manager",
    ],
    discount: 15,
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Premium Care",
    price: "$99",
    period: "/month",
    originalPrice: "$149",
    description: "Comprehensive home management for busy homeowners",
    features: [
      "Everything in Home Care Plus",
      "25% discount on all services",
      "Monthly maintenance included",
      "Emergency service priority",
      "Custom maintenance schedule",
      "Concierge-level support",
      "Home value protection plan",
    ],
    discount: 25,
    popular: false,
    cta: "Get Premium Care",
  },
]

const savingsExamples = [
  { service: "House Cleaning (2BR)", regular: "$149", plus: "$127", premium: "$112", savings: "$37" },
  { service: "Handyman (2 hours)", regular: "$150", plus: "$128", premium: "$113", savings: "$37" },
  { service: "Gutter Cleaning", regular: "$199", plus: "$169", premium: "$149", savings: "$50" },
  { service: "Pressure Washing", regular: "$249", plus: "$212", premium: "$187", savings: "$62" },
  { service: "Junk Removal", regular: "$299", plus: "$254", premium: "$224", savings: "$75" },
]

export function PricingOverview() {
  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Transparent Pricing, No Surprises</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See exactly what you'll pay before booking. All prices include materials, labor, and our satisfaction
            guarantee. Choose the plan that fits your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/book-now">Book a Service</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save money and get priority service with our subscription plans
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {subscriptionPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">{plan.description}</CardDescription>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}
                      <span className="text-lg text-gray-600">{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-lg text-gray-500 line-through">{plan.originalPrice}/month</div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.discount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center text-green-800">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="font-medium">{plan.discount}% off all services</span>
                      </div>
                    </div>
                  )}

                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link href={plan.popular ? "/signup" : "/book-now"}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Service Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing for all our professional home services
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {servicesPricing.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.services.map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{service.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See How Much You Save</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare costs with and without a subscription plan
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Pay-As-You-Go</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Home Care Plus</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Premium Care</th>
                      <th className="text-center py-3 px-4 font-semibold text-green-600">Max Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savingsExamples.map((example, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-900">{example.service}</td>
                        <td className="py-4 px-4 text-center text-gray-600">{example.regular}</td>
                        <td className="py-4 px-4 text-center font-semibold text-blue-600">{example.plus}</td>
                        <td className="py-4 px-4 text-center font-semibold text-green-600">{example.premium}</td>
                        <td className="py-4 px-4 text-center font-bold text-green-600">{example.savings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Average customer saves $126/month with Home Care Plus
                  </h3>
                  <p className="text-blue-700 mb-4">That's $1,512 in savings per year!</p>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/signup">Start Your Free Trial</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Guarantees */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Pricing Promise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in transparent, fair pricing with no surprises
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Hidden Fees</h3>
                <p className="text-gray-600">
                  The price you see is the price you pay. All materials, labor, and taxes included.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Price Match Guarantee</h3>
                <p className="text-gray-600">
                  Find a lower price for the same service? We'll match it and beat it by 10%.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Satisfaction Guarantee</h3>
                <p className="text-gray-600">Not happy with the service? We'll make it right or refund your money.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
