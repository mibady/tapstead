//
Temporary
file

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, MapPin, Phone, Mail, Bell, Clock, Wrench, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Service } from "@/lib/services/service-data"
import { submitQuoteRequest, QuoteRequestSubmission } from "@/lib/services/booking-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface QuoteRequestConfirmationProps {
  bookingData: any
}

export function QuoteRequestConfirmation({ bookingData }: QuoteRequestConfirmationProps) {
  const [requestId, setRequestId] = useState<string>(`QR-${Date.now()}`)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  
  useEffect(() => {
    // Check if user is authenticated
    const supabase = createClient()
    
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      }
    }
    
    getUser()
  }, [])
  
  useEffect(() => {
    // Submit quote request to database when component mounts
    if (!isSubmitted && !isSubmitting && user) {
      submitQuoteRequestToDatabase()
    }
  }, [user, isSubmitted, isSubmitting])
  
  const submitQuoteRequestToDatabase = async () => {
    if (!user) {
      setError("You must be logged in to submit a quote request")
      return
    }
    
    try {
      setIsSubmitting(true)
      setError(null)
      
      const quoteSubmission: QuoteRequestSubmission = {
        service_id: bookingData.service.id,
        customer_id: user.id,
        preferred_date: bookingData.details?.preferredDate,
        preferred_time: bookingData.details?.preferredTime,
        address: bookingData.details.address,
        project_details: bookingData.details.projectDetails || "",
        estimated_budget: bookingData.details.estimatedBudget,
        urgency: bookingData.details.urgency || "standard",
        photos: bookingData.details.photos || [],
        status: 'pending'
      }
      
      const { data, error } = await submitQuoteRequest(quoteSubmission)
      
      if (error) {
        throw error
      }
      
      if (data) {
        setRequestId(data.id)
        setIsSubmitted(true)
      }
    } catch (err) {
      console.error("Error submitting quote request:", err)
      setError(`Failed to submit quote request: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {isSubmitting && (
        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-medium text-blue-800 mb-2">Processing Your Request</h3>
            <p className="text-blue-600">Please wait while we submit your quote request...</p>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {(!isSubmitting || isSubmitted) && (
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
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
                <div className="font-medium">Preferred Start Date</div>
                <div className="text-sm text-gray-600">
                  {bookingData.details?.preferredDate}
                  {bookingData.details?.preferredTime && ` at ${bookingData.details.preferredTime}`}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <div className="font-medium">Project Location</div>
                <div className="text-sm text-gray-600">{bookingData.details?.address}</div>
              </div>
            </div>

            {bookingData.details?.projectDetails && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-sm mb-1">Project Description</div>
                <div className="text-sm text-gray-600">{bookingData.details.projectDetails}</div>
              </div>
            )}

            {bookingData.details?.estimatedBudget && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-sm mb-1">Estimated Budget</div>
                <div className="text-sm text-green-600">{bookingData.details.estimatedBudget}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  1
                </div>
                <div>
                  <div className="font-medium text-sm">Professional Review</div>
                  <div className="text-xs text-gray-600">Our expert will assess your project details</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  2
                </div>
                <div>
                  <div className="font-medium text-sm">Site Assessment (if needed)</div>
                  <div className="text-xs text-gray-600">We may schedule a quick site visit for accuracy</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  3
                </div>
                <div>
                  <div className="font-medium text-sm">Detailed Quote</div>
                  <div className="text-xs text-gray-600">Receive comprehensive quote within 24 hours</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                  4
                </div>
                <div>
                  <div className="font-medium text-sm">Book Instantly</div>
                  <div className="text-xs text-gray-600">Accept your quote and schedule the service online</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="flex items-center text-amber-700 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Quote expires in 7 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Stay Updated
          </CardTitle>
          <CardDescription>We'll keep you informed throughout the process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Email Updates</h3>
              <p className="text-sm text-gray-600">Confirmation and quote delivery via email</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Phone Contact</h3>
              <p className="text-sm text-gray-600">Direct contact for any questions or clarifications</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Dashboard Updates</h3>
              <p className="text-sm text-gray-600">Track your quote status in your account dashboard</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" variant="outline">
          <Phone className="w-4 h-4 mr-2" />
          Call Us: (555) 123-4567
        </Button>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/dashboard">View My Requests</Link>
        </Button>
      </div>

      {/* Support */}
      <Card className="text-center">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">Questions About Your Quote Request?</h3>
          <p className="text-gray-600 mb-4">Our team is here to help clarify any details about your project</p>
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
  )
}
