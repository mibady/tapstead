import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Star, TrendingUp } from "lucide-react"

interface DashboardOverviewProps {
  bookings: any[]
  subscription: any
}

export function DashboardOverview({ bookings, subscription }: DashboardOverviewProps) {
  const totalBookings = bookings.length
  const completedBookings = bookings.filter((b) => b.status === "completed").length
  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.final_price || booking.estimated_price), 0)
  const avgRating = bookings.length > 0 ? 4.8 : 0 // Mock average rating

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings.toString(),
      description: `${completedBookings} completed`,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toLocaleString()}`,
      description: subscription ? `Saving ${subscription.discount_percentage}% with plan` : "No active plan",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Average Rating",
      value: avgRating.toFixed(1),
      description: "Service satisfaction",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "This Month",
      value: bookings
        .filter((b) => {
          const bookingDate = new Date(b.created_at)
          const now = new Date()
          return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear()
        })
        .length.toString(),
      description: "Services booked",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
