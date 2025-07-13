import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, DollarSign, Star, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AdminDashboardProps {
  stats: {
    totalBookings: number
    activeProviders: number
    revenue: number
    customerSatisfaction: number
  }
  recentBookings: any[]
}

export function AdminDashboard({ stats, recentBookings }: AdminDashboardProps) {
  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      description: "All time bookings",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Active Providers",
      value: stats.activeProviders.toString(),
      description: "Verified professionals",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      description: "Platform revenue",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Satisfaction",
      value: `${stats.customerSatisfaction}/5`,
      description: "Average rating",
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform performance and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest service appointments</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/bookings">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{booking.services?.title}</div>
                    <div className="text-sm text-gray-600">
                      {booking.users?.first_name} {booking.users?.last_name}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    <div className="text-sm font-medium">${booking.final_price || booking.estimated_price}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col" asChild>
                <Link href="/admin/providers">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Manage Providers</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" asChild>
                <Link href="/admin/services">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Service Settings</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" asChild>
                <Link href="/admin/analytics">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>View Analytics</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" asChild>
                <Link href="/admin/customers">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Customer Support</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
