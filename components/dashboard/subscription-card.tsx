import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Calendar, Percent, ArrowRight } from "lucide-react"
import Link from "next/link"

interface SubscriptionCardProps {
  subscription: any
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-yellow-600" />
            Upgrade to Save More
          </CardTitle>
          <CardDescription>Get discounts on all services with a plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Home Care Plus</span>
              <span className="font-medium">15% off all services</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Premium Care</span>
              <span className="font-medium">25% off all services</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">Average customer saves</div>
            <div className="text-2xl font-bold text-blue-900">$126/month</div>
          </div>

          <Button className="w-full" asChild>
            <Link href="/dashboard/subscription">
              Choose a Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-yellow-600" />
            Your Plan
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">Active</Badge>
        </div>
        <CardDescription>{subscription.plan_type}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Price</span>
            <span className="font-medium">${subscription.monthly_price}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Discount</span>
            <div className="flex items-center">
              <Percent className="h-3 w-3 mr-1 text-green-600" />
              <span className="font-medium text-green-600">{subscription.discount_percentage}% off</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Next Billing</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="text-sm">{new Date(subscription.next_billing_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-green-800 mb-1">Services Included</div>
          <div className="text-xs text-green-600">{subscription.services_included.join(", ")}</div>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/subscription">
            Manage Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
