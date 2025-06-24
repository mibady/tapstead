"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Calendar, Clock, MapPin, Phone, Mail, ClipboardCheck, AlertCircle, Wrench, Bell } from "lucide-react"
import { supabase } from '@/lib/supabase/client'
import { submitQuoteRequest, QuoteRequestSubmission } from "@/lib/services/booking-service"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { QuoteRequestConfirmationSkeleton } from "@/components/ui/skeleton-loaders"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface QuoteRequestConfirmationProps {
  bookingData: any
}

export function QuoteRequestConfirmation({ bookingData }: QuoteRequestConfirmationProps) {
  const [requestId, setRequestId] = useState<string>(`QR-${Date.now()}`)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      } else {
        setErrorMsg("You must be logged in to submit a quote request")
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    if (!isSubmitted && !isSubmitting && user) {
      submitQuoteRequestToDatabase()
    }
  }, [user, isSubmitted, isSubmitting])

  const submitQuoteRequestToDatabase = async () => {
    if (!user) {
      setErrorMsg("You must be logged in to submit a quote request")
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMsg(null)
      
      // Create the quote request submission object
      const quoteSubmission: QuoteRequestSubmission = {
        customer_id: user.id,
        service_id: bookingData.service?.id || "",
        preferred_date: bookingData.details?.date || null,
        preferred_time: bookingData.details?.time || null,
        address: bookingData.details?.address || "",
        project_details: bookingData.details?.projectDescription || "",
        estimated_budget: bookingData.details?.budget || "",
        urgency: bookingData.details?.urgency || "standard",
        photos: bookingData.details?.photos || [],
        status: "pending"
      }
      
      const { data, error } = await submitQuoteRequest(quoteSubmission)
      
      if (error) throw error
      
      if (data) {
        setRequestId(data.id || requestId)
      }
      
      setIsSubmitted(true)
    } catch (err) {
      console.error("Error submitting quote request:", err)
      setErrorMsg(`Failed to submit quote request: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show skeleton loader during submission
  if (isSubmitting && !isSubmitted) {
    return (
      <ErrorBoundary>
        <QuoteRequestConfirmationSkeleton />
      </ErrorBoundary>
    )
  }
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {errorMsg && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        
        {isSubmitted && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Request Submitted!</h1>
              <p className="text-xl text-gray-600 mb-4">
                We'll review your {bookingData.service?.title} project and send you a detailed quote
              </p>
              <Badge className="bg-blue-600 text-lg px-4 py-2">Request ID: {requestId}</Badge>
            </CardContent>
          </Card>
        )}

        {isSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Information about your requested service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Service Type</p>
                  <p className="text-gray-600">{bookingData.service?.title || "Custom Service"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Preferred Date</p>
                  <p className="text-gray-600">{bookingData.details?.date || "Flexible"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Preferred Time</p>
                  <p className="text-gray-600">{bookingData.details?.time || "Flexible"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Service Location</p>
                  <p className="text-gray-600">{bookingData.details?.address || "Not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Urgency</p>
                  <p className="text-gray-600">{bookingData.details?.urgency || "Standard"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>Here's what you can expect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Quote Review</p>
                  <p className="text-gray-600">Our team will review your request and prepare a detailed quote</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-gray-600">A service provider will contact you to discuss details</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Quote Delivery</p>
                  <p className="text-gray-600">You'll receive your quote via email and in your dashboard</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isSubmitted && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="default" asChild>
              <Link href="/services">Browse More Services</Link>
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
