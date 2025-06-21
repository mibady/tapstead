"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth/auth-context"

export function useRealtimeBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Fetch initial bookings
    const fetchBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select(`
          *,
          services (title, category),
          providers (business_name, rating)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setBookings(data || [])
      setLoading(false)
    }

    fetchBookings()

    // Set up real-time subscription
    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((booking) => (booking.id === payload.new.id ? { ...booking, ...payload.new } : booking)),
            )
          } else if (payload.eventType === "DELETE") {
            setBookings((prev) => prev.filter((booking) => booking.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return { bookings, loading }
}
