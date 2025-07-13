"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, User, Phone, Mail, ArrowLeft } from "lucide-react"
import { Loading } from "@/components/ui/loading"
import Link from "next/link"

interface BookingDetails {
  id: string
  service_type: string
  status: string
  scheduled_date: string
  scheduled_time: string
  address: string
  total_amount: number
  provider_name?: string
  provider_phone?: string
  provider_email?: string
  special_instructions?: string
  created_at: string
}

export default function BookingDetailsPage() {
  const [user, setUser] = useState<any>(null)
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndLoadBooking = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login?redirect=/dashboard/bookings")
        return
      }

      setUser(user)

      // Load booking details
      const { data: bookingData, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", params.id)
        .eq("customer_id", user.id)
        .single()

      if (error) {
        console.error("Error loading booking:", error)
        router.push("/dashboard/bookings")
      } else {
        setBooking(bookingData)
      }

      setLoading(false)
    }

    checkUserAndLoadBooking()
  }, [router, params.id, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h1>
          <Button asChild>
            <Link href="/dashboard/bookings">Back to Bookings</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/bookings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="capitalize text-2xl">{booking.service_type.replace("-", " ")}</CardTitle>
                    <CardDescription>
                      Booking #{booking.id.slice(0, 8)} • Booked on {new Date(booking.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Service Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(booking.scheduled_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{booking.scheduled_time}</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{booking.address}</span>
                    </div>
                  </div>
                </div>

                {booking.special_instructions && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Special Instructions</h3>
                      <p className="text-gray-600">{booking.special_instructions}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {booking.provider_name && (
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{booking.provider_name}</span>
                    </div>
                    {booking.provider_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a href={`tel:${booking.provider_phone}`} className="text-blue-600 hover:underline">
                          {booking.provider_phone}
                        </a>
                      </div>
                    )}
                    {booking.provider_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a href={`mailto:${booking.provider_email}`} className="text-blue-600 hover:underline">
                          {booking.provider_email}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service Total</span>
                    <span>${booking.total_amount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid</span>
                    <span>${booking.total_amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.status === "confirmed" && (
                  <Button variant="outline" className="w-full bg-transparent">
                    Reschedule Service
                  </Button>
                )}
                {booking.status === "completed" && <Button className="w-full">Leave Review</Button>}
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
