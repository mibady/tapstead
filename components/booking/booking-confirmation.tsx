"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, MapPin, Phone, Mail, Download, Share, Wrench, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Service } from "@/lib/services/service-data"
import { submitBooking, BookingSubmission } from "@/lib/services/booking-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { supabase } from '@/lib/supabase/client'
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { BookingConfirmationSkeleton } from "@/components/ui/skeleton-loaders"

interface BookingConfirmationProps {
  bookingData: any
}

export function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const [bookingId, setBookingId] = useState<string>(bookingData.payment?.bookingId || `TS-${Date.now()}`)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const total = bookingData.payment?.finalTotal || 0
  const router = useRouter()
  
  useEffect(() => {
    // Check if user is authenticated
    
    
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      }
    }
    
    getUser()
  }, [])
  
  useEffect(() => {
    // Submit booking to database when component mounts
    if (!isSubmitted && !isSubmitting && user) {
      submitBookingToDatabase()
    }
  }, [user])
  
  const submitBookingToDatabase = async () => {
    if (!user) {
      setError("You must be logged in to complete a booking")
      return
    }
    
    try {
      setIsSubmitting(true)
      setError(null)
      
      const bookingSubmission: BookingSubmission = {
        service_id: bookingData.service.id,
        customer_id: user.id,
        booking_date: bookingData.details.date,
        booking_time: bookingData.details.time,
        address: bookingData.details.address,
        special_instructions: bookingData.details.specialInstructions || "",
        home_size: bookingData.details.homeSize,
        urgency: bookingData.details.urgency,
        total_amount: total,
        status: 'confirmed'
      }
      
      const { data, error } = await submitBooking(bookingSubmission)
      
      if (error) {
        throw error
      }
      
      if (data) {
        setBookingId(data.id)
        setIsSubmitted(true)
      }
    } catch (err) {
      console.error("Error submitting booking:", err)
      setError(`Failed to submit booking: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {isSubmitting && !isSubmitted && (
          <BookingConfirmationSkeleton />
        )}
      
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      
        {/* Success Header */}
        {(!isSubmitting || isSubmitted) && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-xl text-gray-600 mb-4">Your {bookingData.service?.title} service has been scheduled</p>
              <Badge className="bg-green-600 text-lg px-4 py-2">Booking ID: {bookingId}</Badge>
            </CardContent>
          </Card>
        )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              {bookingData.service?.icon ? (
                <bookingData.service.icon className="w-5 h-5 text-blue-600 mt-1" />
              ) : (
                <Wrench className="w-5 h-5 text-blue-600 mt-1" />
              )}
              <div>
                <div className="font-medium">{bookingData.service?.title}</div>
                <div className="text-sm text-gray-600">{bookingData.service?.description}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <div className="font-medium">
                  {bookingData.details?.date} at {bookingData.details?.time}
                </div>
                <div className="text-sm text-gray-600">Estimated duration: {bookingData.service?.duration || "1-2 hours"}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <div className="font-medium">Service Address</div>
                <div className="text-sm text-gray-600">{bookingData.details?.address}</div>
              </div>
            </div>

            {bookingData.details?.specialInstructions && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-sm mb-1">Special Instructions</div>
                <div className="text-sm text-gray-600">{bookingData.details.specialInstructions}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service Total</span>
                <span>${bookingData.details?.estimatedPrice || 0}</span>
              </div>

              {bookingData.customer?.appliedDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({bookingData.customer.appliedDiscount}%)</span>
                  <span>
                    -$
                    {Math.round(
                      (bookingData.details?.estimatedPrice || 0) * (bookingData.customer.appliedDiscount / 100),
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${Math.round(total * 0.08)}</span>
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid</span>
                  <span className="text-green-600">${total}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-1">Payment Method</div>
              <div className="text-sm text-blue-600">
                •••• •••• •••• {bookingData.payment?.cardNumber?.slice(-4) || "1234"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
          <CardDescription>Here's what you can expect</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Confirmation Email</h3>
              <p className="text-sm text-gray-600">You'll receive a detailed confirmation email within 5 minutes</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Pro Assignment</h3>
              <p className="text-sm text-gray-600">We'll assign a qualified professional and send you their details</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Service Day</h3>
              <p className="text-sm text-gray-600">
                Your pro will arrive on time and complete the work to your satisfaction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
        <Button size="lg" variant="outline">
          <Share className="w-4 h-4 mr-2" />
          Share Booking
        </Button>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/dashboard">View My Bookings</Link>
        </Button>
      </div>

      {/* Support */}
      <Card className="text-center">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">Our customer support team is available 24/7 to assist you</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Call (555) 123-4567
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </ErrorBoundary>
  )
}
