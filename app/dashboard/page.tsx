"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SubscriptionCard } from "@/components/dashboard/subscription-card"
import { supabase } from "@/lib/supabase/client"

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch recent bookings with real-time data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
        *,
        services (title, category),
        providers (business_name, rating, phone)
      `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (bookingsError) throw bookingsError

      // Fetch active subscription
      const { data: subscriptionData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "active")
        .maybeSingle()

      if (subError && subError.code !== "PGRST116") throw subError

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle()

      if (userError && userError.code !== "PGRST116") {
        // Create user profile if it doesn't exist
        await supabase.from("users").insert({
          id: user?.id,
          email: user?.email!,
          first_name: user?.user_metadata?.first_name || "",
          last_name: user?.user_metadata?.last_name || "",
        })
      }

      setBookings(bookingsData || [])
      setSubscription(subscriptionData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Show user-friendly error message
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.first_name || "there"}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your home services</p>
        </div>

        <DashboardOverview bookings={bookings} subscription={subscription} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentBookings bookings={bookings} />
          </div>
          <div className="space-y-8">
            <QuickActions />
            <SubscriptionCard subscription={subscription} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
