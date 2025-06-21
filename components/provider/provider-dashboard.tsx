import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, Star, TrendingUp, Clock, MapPin, Phone, MessageCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface ProviderDashboardProps {
  provider: any
  jobs: any[]
  earnings: number
}

export function ProviderDashboard({ provider, jobs, earnings }: ProviderDashboardProps) {
  const todayJobs = jobs.filter((job) => {
    const today = new Date().toDateString()
    const jobDate = new Date(job.scheduled_date).toDateString()
    return today === jobDate
  })

  const completedJobs = jobs.filter((job) => job.status === "completed")
  const completionRate = jobs.length > 0 ? (completedJobs.length / jobs.length) * 100 : 0

  const stats = [
    {
      title: "Today's Jobs",
      value: todayJobs.length.toString(),
      description: "Scheduled for today",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Total Earnings",
      value: `$${earnings.toLocaleString()}`,
      description: "All time earnings",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Rating",
      value: provider?.rating?.toFixed(1) || "5.0",
      description: `${provider?.total_jobs || 0} jobs completed`,
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "Completion Rate",
      value: `${completionRate.toFixed(0)}%`,
      description: "Job completion rate",
      icon: TrendingUp,
      color: "text-purple-600",
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
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {provider?.business_name || "Professional"}!</h1>
        <p className="text-gray-600">Here's your business overview for today</p>
      </div>

      {/* Stats Grid */}
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your appointments for today</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/provider/jobs">View All Jobs</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {todayJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs scheduled today</h3>
                  <p className="text-gray-600">Enjoy your day off or check for new opportunities</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{job.services?.title}</h3>
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.scheduled_time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.address.split(",")[0]}
                            </div>
                          </div>

                          <div className="text-sm text-gray-600">
                            Customer: {job.users?.first_name} {job.users?.last_name}
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="font-medium">${job.final_price || job.estimated_price}</div>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance & Quick Actions */}
        <div className="space-y-6">
          {/* Performance Card */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Your service metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">{completionRate.toFixed(0)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Customer Rating</span>
                  <span className="font-medium">{provider?.rating?.toFixed(1) || "5.0"}/5</span>
                </div>
                <Progress value={(provider?.rating || 5) * 20} className="h-2" />
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <div className="font-medium text-green-900">Great Performance!</div>
                    <div className="text-sm text-green-700">Keep up the excellent work</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/provider/schedule">
                    <Calendar className="mr-2 h-4 w-4" />
                    Update Availability
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/provider/earnings">
                    <DollarSign className="mr-2 h-4 w-4" />
                    View Earnings
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/provider/profile">
                    <Star className="mr-2 h-4 w-4" />
                    Update Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
