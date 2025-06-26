import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, CreditCard, MessageCircle } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Book Service",
      description: "Schedule a new service",
      icon: Plus,
      href: "/book-now",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "View Schedule",
      description: "See upcoming appointments",
      icon: Calendar,
      href: "/dashboard/bookings",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Manage Plan",
      description: "Update subscription",
      icon: CreditCard,
      href: "/dashboard/subscription",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Get Support",
      description: "Contact customer service",
      icon: MessageCircle,
      href: "/dashboard/support",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link href={action.href}>
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-600">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
