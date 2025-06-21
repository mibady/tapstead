"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { supabase } from "@/lib/supabase/client"

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeProviders: 0,
    revenue: 0,
    customerSatisfaction: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // Fetch booking stats
      const { data: bookings } = await supabase.from("bookings").select("*")

      // Fetch provider stats
      const { data: providers } = await supabase.from("providers").select("*").eq("active", true)

      // Calculate stats
      const totalRevenue =
        bookings?.reduce((sum, booking) => sum + (booking.final_price || booking.estimated_price), 0) || 0

      setStats({
        totalBookings: bookings?.length || 0,
        activeProviders: providers?.length || 0,
        revenue: totalRevenue,
        customerSatisfaction: 4.8, // Mock data
      })

      // Get recent bookings
      const { data: recent } = await supabase
        .from("bookings")
        .select(`
          *,
          services (title),
          users (first_name, last_name),
          providers (business_name)
        `)
        .order("created_at", { ascending: false })
        .limit(10)

      setRecentBookings(recent || [])
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminDashboard stats={stats} recentBookings={recentBookings} />
    </AdminLayout>
  )
}
