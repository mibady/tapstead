"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { Loading } from "@/components/ui/loading"

export default function AdminAnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login?redirect=/admin/analytics")
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  if (loading) {
    return <Loading />
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">View platform analytics and insights</p>
        </div>
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  )
}
