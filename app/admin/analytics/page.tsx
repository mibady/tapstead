"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <AdminLayout>
      <AnalyticsDashboard timeRange={timeRange} onTimeRangeChange={setTimeRange} />
    </AdminLayout>
  )
}
