"use client"

import { useState, lazy, Suspense } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const AnalyticsDashboard = lazy(() => import("@/components/analytics/analytics-dashboard").then(module => ({ default: module.AnalyticsDashboard })))

function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loading Analytics...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loading Charts...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <AdminLayout>
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsDashboard timeRange={timeRange} onTimeRangeChange={setTimeRange} />
      </Suspense>
    </AdminLayout>
  )
}
