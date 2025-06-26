"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminStats, getRecentBookings } from "@/lib/actions/admin-actions"

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeProviders: 0,
    revenue: 0,
    customerSatisfaction: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setError(null)
      
      // Fetch stats with server-side authorization
      const statsResult = await getAdminStats()
      if (statsResult.success) {
        setStats(statsResult.data)
      } else {
        setError(statsResult.message || 'Failed to fetch stats')
        return
      }

      // Fetch recent bookings with server-side authorization
      const bookingsResult = await getRecentBookings()
      if (bookingsResult.success) {
        setRecentBookings(bookingsResult.data)
      } else {
        setError(bookingsResult.message || 'Failed to fetch bookings')
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
      setError("Failed to load admin data. Please check your permissions.")
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

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600 text-center">
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p>{error}</p>
          </div>
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
