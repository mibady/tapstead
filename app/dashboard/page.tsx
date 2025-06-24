"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SubscriptionCard } from "@/components/dashboard/subscription-card"
import { supabase } from "@/lib/supabase/client"

import { getCustomerBookings, getCustomerQuoteRequests, getCustomerSubscription } from "@/lib/services/booking-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, FileText } from "lucide-react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders"

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <CustomerDashboard />
    </ErrorBoundary>
  )
}

function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [quoteRequests, setQuoteRequests] = useState<any[]>([])
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      

      // Fetch real bookings from our booking service
      const { data: bookingsData, error: bookingsError } = await getCustomerBookings(user?.id || '')
      
      if (bookingsError) throw bookingsError

      // Fetch quote requests
      const { data: quoteData, error: quoteError } = await getCustomerQuoteRequests(user?.id || '')
      
      if (quoteError) throw quoteError

      // Fetch active subscription
      const { data: subscriptionData, error: subError } = await getCustomerSubscription(user?.id || '')

      if (subError) throw subError



      setBookings(bookingsData || [])
      setQuoteRequests(quoteData || [])
      setSubscription(subscriptionData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || "there"}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your home services</p>
        </div>

        <DashboardOverview bookings={bookings} subscription={subscription} />

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{booking.service?.name || "Service"}</CardTitle>
                            <Badge variant={getStatusVariant(booking.status)}>{formatStatus(booking.status)}</Badge>
                          </div>
                          <CardDescription>Booking #{booking.id.substring(0, 8)}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{booking.booking_time}</span>
                            </div>
                            <div className="flex items-center col-span-2">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="truncate">{booking.address}</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-medium">${booking.total_amount.toFixed(2)}</span>
                            <button className="text-blue-600 hover:underline text-sm">View Details</button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500">You don't have any bookings yet.</p>
                      <button className="mt-4 text-blue-600 hover:underline">Book a Service</button>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-8">
                <QuickActions />
                <SubscriptionCard subscription={subscription} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quotes">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {quoteRequests.length > 0 ? (
                  <div className="space-y-4">
                    {quoteRequests.map((quote) => (
                      <Card key={quote.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{quote.service?.name || "Quote Request"}</CardTitle>
                            <Badge variant={getQuoteStatusVariant(quote.status)}>{formatQuoteStatus(quote.status)}</Badge>
                          </div>
                          <CardDescription>Request #{quote.id.substring(0, 8)}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            {quote.preferred_date && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{new Date(quote.preferred_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {quote.preferred_time && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{quote.preferred_time}</span>
                              </div>
                            )}
                            <div className="flex items-center col-span-2">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="truncate">{quote.address}</span>
                            </div>
                            <div className="flex items-center col-span-2">
                              <FileText className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="truncate">{quote.project_details.substring(0, 50)}...</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-medium">Submitted on {new Date(quote.created_at).toLocaleDateString()}</span>
                            <button className="text-blue-600 hover:underline text-sm">View Details</button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500">You don't have any quote requests yet.</p>
                      <button className="mt-4 text-blue-600 hover:underline">Request a Quote</button>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-8">
                <QuickActions />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

// Helper functions for status badges
function getStatusVariant(status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined {
  switch (status) {
    case 'confirmed': return 'default'
    case 'pending': return 'secondary'
    case 'in-progress': return 'outline'
    case 'completed': return 'default'
    case 'cancelled': return 'destructive'
    default: return 'secondary'
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')
}

function getQuoteStatusVariant(status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined {
  switch (status) {
    case 'pending': return 'secondary'
    case 'reviewed': return 'outline'
    case 'quoted': return 'default'
    case 'accepted': return 'default'
    case 'declined': return 'destructive'
    default: return 'secondary'
  }
}

function formatQuoteStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
