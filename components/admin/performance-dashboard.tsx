"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Clock, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface PerformanceMetrics {
  totalRequests: number
  averageResponseTime: number
  slowestEndpoints: Array<{
    name: string
    value: number
    metadata?: Record<string, any>
  }>
  errorRate: number
  throughput: number
}

interface BookingMetrics {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  averageBookingTime: number
  conversionRate: number
  revenueTotal: number
}

export function PerformanceDashboard() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [bookingMetrics, setBookingMetrics] = useState<BookingMetrics | null>(null)
  const [timeRange, setTimeRange] = useState<"hour" | "day" | "week">("day")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [timeRange])

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const [performanceRes, bookingRes] = await Promise.all([
        fetch(`/api/admin/metrics/performance?range=${timeRange}`),
        fetch(`/api/admin/metrics/bookings?range=${timeRange}`),
      ])

      const performance = await performanceRes.json()
      const booking = await bookingRes.json()

      setPerformanceMetrics(performance)
      setBookingMetrics(booking)
    } catch (error) {
      console.error("Failed to fetch metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceStatus = (responseTime: number) => {
    if (responseTime < 1000) return { status: "excellent", color: "bg-green-500" }
    if (responseTime < 2000) return { status: "good", color: "bg-yellow-500" }
    return { status: "poor", color: "bg-red-500" }
  }

  const mockChartData = [
    { time: "00:00", responseTime: 850, requests: 45 },
    { time: "04:00", responseTime: 920, requests: 32 },
    { time: "08:00", responseTime: 1200, requests: 89 },
    { time: "12:00", responseTime: 1450, requests: 156 },
    { time: "16:00", responseTime: 1100, requests: 134 },
    { time: "20:00", responseTime: 980, requests: 78 },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Performance Dashboard</h2>
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
          <TabsList>
            <TabsTrigger value="hour">Last Hour</TabsTrigger>
            <TabsTrigger value="day">Last 24 Hours</TabsTrigger>
            <TabsTrigger value="week">Last Week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics?.averageResponseTime.toFixed(0)}ms</div>
            <div className="flex items-center space-x-2 mt-2">
              <div
                className={`h-2 w-2 rounded-full ${getPerformanceStatus(performanceMetrics?.averageResponseTime || 0).color}`}
              />
              <p className="text-xs text-muted-foreground">
                {getPerformanceStatus(performanceMetrics?.averageResponseTime || 0).status}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics?.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{performanceMetrics?.throughput.toFixed(1)} req/hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((performanceMetrics?.errorRate || 0) * 100).toFixed(2)}%</div>
            <Progress value={(performanceMetrics?.errorRate || 0) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Conversion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((bookingMetrics?.conversionRate || 0) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {bookingMetrics?.completedBookings} of {bookingMetrics?.totalBookings} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
            <CardDescription>Average response time over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>Number of requests over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Slowest Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Slowest Endpoints</CardTitle>
          <CardDescription>Endpoints with highest response times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics?.slowestEndpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{endpoint.metadata?.method || "GET"}</Badge>
                  <span className="font-medium">{endpoint.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{endpoint.value.toFixed(0)}ms</span>
                  <div className={`h-2 w-2 rounded-full ${getPerformanceStatus(endpoint.value).color}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Performance</CardTitle>
          <CardDescription>Key booking metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Booking Time</p>
              <p className="text-2xl font-bold">
                {Math.floor((bookingMetrics?.averageBookingTime || 0) / 60)}m{" "}
                {((bookingMetrics?.averageBookingTime || 0) % 60).toFixed(0)}s
              </p>
              <Progress
                value={Math.min(((bookingMetrics?.averageBookingTime || 0) / 180) * 100, 100)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground">Target: &lt; 3 minutes</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">${(bookingMetrics?.revenueTotal || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                This {timeRange === "hour" ? "hour" : timeRange === "day" ? "day" : "week"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Cancellation Rate</p>
              <p className="text-2xl font-bold">
                {(((bookingMetrics?.cancelledBookings || 0) / (bookingMetrics?.totalBookings || 1)) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">{bookingMetrics?.cancelledBookings} cancelled bookings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
