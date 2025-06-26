"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Calendar, ArrowUp, ArrowDown, Target, Zap } from "lucide-react"

interface AnalyticsDashboardProps {
  timeRange: string
  onTimeRangeChange: (range: string) => void
}

export function AnalyticsDashboard({ timeRange, onTimeRangeChange }: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState({
    totalRevenue: 125000,
    totalBookings: 1250,
    conversionRate: 3.2,
    customerAcquisitionCost: 45,
    averageOrderValue: 185,
    customerLifetimeValue: 850,
    churnRate: 2.1,
    netPromoterScore: 72,
  })

  const [trends, setTrends] = useState({
    revenue: { value: 12.5, direction: "up" },
    bookings: { value: 8.3, direction: "up" },
    conversion: { value: -2.1, direction: "down" },
    retention: { value: 5.7, direction: "up" },
  })

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: trends.revenue,
      icon: DollarSign,
      color: "text-green-600",
      description: "Monthly recurring revenue",
    },
    {
      title: "Total Bookings",
      value: metrics.totalBookings.toLocaleString(),
      change: trends.bookings,
      icon: Calendar,
      color: "text-blue-600",
      description: "Services booked this period",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      change: trends.conversion,
      icon: Target,
      color: "text-purple-600",
      description: "Visitors to customers",
    },
    {
      title: "Avg Order Value",
      value: `$${metrics.averageOrderValue}`,
      change: trends.retention,
      icon: TrendingUp,
      color: "text-orange-600",
      description: "Average booking value",
    },
  ]

  const customerMetrics = [
    {
      label: "Customer Acquisition Cost",
      value: `$${metrics.customerAcquisitionCost}`,
      target: "$40",
      status: "warning",
    },
    {
      label: "Customer Lifetime Value",
      value: `$${metrics.customerLifetimeValue}`,
      target: "$800",
      status: "success",
    },
    {
      label: "Churn Rate",
      value: `${metrics.churnRate}%`,
      target: "<2%",
      status: "warning",
    },
    {
      label: "Net Promoter Score",
      value: metrics.netPromoterScore,
      target: "70+",
      status: "success",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "danger":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and growth metrics</p>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center space-x-2 mt-2">
                <div
                  className={`flex items-center text-sm ${
                    kpi.change.direction === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.change.direction === "up" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(kpi.change.value)}%
                </div>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customer Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Metrics</CardTitle>
            <CardDescription>Key customer performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{metric.label}</div>
                    <div className="text-sm text-gray-600">Target: {metric.target}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{metric.value}</div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status === "success" ? "On Track" : "Needs Attention"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Customer journey optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Website Visitors</span>
                  <span className="font-medium">10,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Service Page Views</span>
                  <span className="font-medium">4,500 (45%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Booking Started</span>
                  <span className="font-medium">1,800 (18%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Bookings Completed</span>
                  <span className="font-medium">320 (3.2%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "3.2%" }}></div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-medium text-blue-900">Optimization Opportunity</div>
                    <div className="text-sm text-blue-700">
                      Improve booking completion rate by 1% to gain 180 more customers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
          <CardDescription>Revenue and booking trends by service category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">House Cleaning</span>
                <span className="text-sm text-gray-600">$45,000 (36%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "36%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Handyman</span>
                <span className="text-sm text-gray-600">$38,000 (30%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Junk Removal</span>
                <span className="text-sm text-gray-600">$25,000 (20%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
