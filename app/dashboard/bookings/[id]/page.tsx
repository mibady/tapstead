"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BookingTracker } from "@/components/tracking/booking-tracker"
import { supabase } from "@/lib/supabase/client"

export default function BookingTrackingPage() {
  const params = useParams()
  const [booking, setBooking] = useState<any>(null)
  const [tracking, setTracking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchBookingData()

      // Set up real-time subscription for tracking updates
      const trackingSubscription = supabase
        .channel("tracking-updates")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tracking",
            filter: `booking_id=eq.${params.id}`,
          },
          (payload) => {
            setTracking(payload.new)
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(trackingSubscription)
      }
    }
  }, [params.id])

  const fetchBookingData = async () => {
    try {
      // Fetch booking details
      const { data: bookingData } = await supabase
        .from("bookings")
        .select(`
          *,
          services (title, category, duration),
          providers (business_name, rating, phone)
        `)
        .eq("id", params.id)
        .single()

      // Fetch tracking information
      const { data: trackingData } = await supabase
        .from("tracking")
        .select("*")
        .eq("booking_id", params.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setBooking(bookingData)
      setTracking(trackingData)
    } catch (error) {
      console.error("Error fetching booking data:", error)
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
      <BookingTracker booking={booking} tracking={tracking} />
    </DashboardLayout>
  )
}
