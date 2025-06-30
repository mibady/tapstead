"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Crown, Check, Percent, ArrowRight, Star, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { supabase } from "@/lib/supabase/client"

const plans = [
  {
    id: "pay-as-you-go",
    name: "Pay-As-You-Go",
    price: 0,
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
  },
  {
    id: "home-care-plus",
    name: "Home Care Plus",
    price: 49,
    originalPrice: 89,
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
  },
  {
    id: "premium-care",
    name: "Premium Care",
    price: 99,
    originalPrice: 149,
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
  },
]

interface SubscriptionManagerProps {
  currentSubscription?: any
}

export function SubscriptionManager({ currentSubscription }: SubscriptionManagerProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [billingAnnually, setBillingAnnually] = useState(false)

  const handleSubscribe = async (planId: string) => {
    if (!user || !supabase) return

    setLoading(true)
    try {
      const plan = plans.find((p) => p.id === planId)
      if (!plan) return

      const { error } = await supabase.from("subscriptions").upsert({
        user_id: user.id,
        plan_type: plan.name,
        status: "active",
        monthly_price: plan.price,
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        services_included: ["cleaning", "handyman", "junk-removal"],
        discount_percentage: plan.discount,
      })

      if (error) throw error

      // Redirect to payment processing
      window.location.href = `/payment?plan=${planId}`
    } catch (error) {
      console.error("Error subscribing:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!currentSubscription || !supabase) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", currentSubscription.id)

      if (error) throw error

      window.location.reload()
    } catch (error) {
      console.error("Error cancelling subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAnnualPrice = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8) // 20% discount for annual
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Save money and get priority service with our subscription plans
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Label htmlFor="billing-toggle" className={!billingAnnually ? "font-medium" : ""}>
            Monthly
          </Label>
          <Switch id="billing-toggle" checked={billingAnnually} onCheckedChange={setBillingAnnually} />
          <Label htmlFor="billing-toggle" className={billingAnnually ? "font-medium" : ""}>
            Annual
            <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
          </Label>
        </div>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-blue-600" />
                <CardTitle>Current Plan: {currentSubscription.plan_type}</CardTitle>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Monthly Price</div>
                <div className="text-lg font-bold">${currentSubscription.monthly_price}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Discount</div>
                <div className="text-lg font-bold text-green-600">{currentSubscription.discount_percentage}% off</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Next Billing</div>
                <div className="text-lg font-bold">
                  {new Date(currentSubscription.next_billing_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button variant="outline">Manage Payment</Button>
              <Button variant="outline" onClick={handleCancelSubscription} disabled={loading}>
                Cancel Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Cards */}
      <div className="grid lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-lg" : ""}`}>
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
                {plan.price === 0 ? (
                  <div className="text-4xl font-bold text-gray-900">Free</div>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-gray-900">
                      ${billingAnnually ? getAnnualPrice(plan.price) : plan.price}
                      <span className="text-lg text-gray-600">/{billingAnnually ? "year" : "month"}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-lg text-gray-500 line-through">
                        ${billingAnnually ? getAnnualPrice(plan.originalPrice) : plan.originalPrice}/
                        {billingAnnually ? "year" : "month"}
                      </div>
                    )}
                    {billingAnnually && (
                      <Badge className="bg-green-100 text-green-800">
                        Save ${plan.price * 12 - getAnnualPrice(plan.price)} annually
                      </Badge>
                    )}
                  </>
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
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">{plan.discount}% off all services</span>
                  </div>
                </div>
              )}

              <Button
                className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || currentSubscription?.plan_type === plan.name}
              >
                {currentSubscription?.plan_type === plan.name ? (
                  "Current Plan"
                ) : plan.price === 0 ? (
                  "Continue Free"
                ) : (
                  <>
                    {currentSubscription ? "Switch to Plan" : "Get Started"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Savings Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>See How Much You Save</CardTitle>
          <CardDescription>Compare costs with and without a subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Pay-As-You-Go</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Home Care Plus</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Premium Care</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-900">House Cleaning (2BR)</td>
                  <td className="py-4 px-4 text-center text-gray-600">$149</td>
                  <td className="py-4 px-4 text-center font-semibold text-blue-600">$127</td>
                  <td className="py-4 px-4 text-center font-semibold text-green-600">$112</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-900">Handyman (2 hours)</td>
                  <td className="py-4 px-4 text-center text-gray-600">$150</td>
                  <td className="py-4 px-4 text-center font-semibold text-blue-600">$128</td>
                  <td className="py-4 px-4 text-center font-semibold text-green-600">$113</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-900">Junk Removal</td>
                  <td className="py-4 px-4 text-center text-gray-600">$299</td>
                  <td className="py-4 px-4 text-center font-semibold text-blue-600">$254</td>
                  <td className="py-4 px-4 text-center font-semibold text-green-600">$224</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-blue-900 mb-1">
                Average customer saves $126/month with Home Care Plus
              </div>
              <div className="text-blue-700">That's $1,512 in savings per year!</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
