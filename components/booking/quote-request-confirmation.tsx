"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Mail, Phone, FileText, Camera, Calendar } from "lucide-react"
import Link from "next/link"

interface QuoteRequestConfirmationProps {
  bookingData: any
}

export function QuoteRequestConfirmation({ bookingData }: QuoteRequestConfirmationProps) {
  const service = bookingData.service
  const details = bookingData.details
  const customer = bookingData.customer

  const requestId = `QR-${Date.now().toString().slice(-6)}`

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-blue-800">Quote Request Submitted!</CardTitle>
          <CardDescription className="text-blue-700">
            We'll review your project and send you a detailed quote within 2 hours
          </CardDescription>
          <div className="mt-4">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Request ID: {requestId}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">{service?.title}</span>
              </div>

              {details?.propertyType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{details.propertyType}</span>
                </div>
              )}

              {details?.propertySize && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Size</span>
                  <span className="font-medium">{details.propertySize}</span>
                </div>
              )}

              {details?.estimatedBudget && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget Range</span>
                  <span className="font-medium">{details.estimatedBudget}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Urgency</span>
                <span className="font-medium capitalize">{details?.urgency}</span>
              </div>

              <div>
                <div className="text-gray-600 mb-2">Project Description</div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">{details?.projectDetails}</div>
              </div>

              {details?.photos?.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {details.photos.length} photo{details.photos.length !== 1 ? "s" : ""} uploaded
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Schedule & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Preferred Date</span>
                <span className="font-medium">{new Date(details?.preferredDate).toLocaleDateString()}</span>
              </div>

              {details?.preferredTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred Time</span>
                  <span className="font-medium">{details.preferredTime}</span>
                </div>
              )}

              <div>
                <div className="text-gray-600 mb-2">Project Address</div>
                <div className="font-medium">{details?.address}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="font-medium">
              {customer?.firstName} {customer?.lastName}
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{customer?.email}</span>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{customer?.phone}</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-1">Communication Preferences</div>
              <div className="text-sm text-blue-700">
                {customer?.communicationPreferences?.email && "Email "}
                {customer?.communicationPreferences?.sms && "SMS "}
                notifications enabled
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              What Happens Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-medium">AI Analysis</div>
                  <div className="text-sm text-gray-600">Our AI reviews your project details and photos</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-medium">Professional Review</div>
                  <div className="text-sm text-gray-600">Expert validates pricing and scope</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-medium">Quote Delivery</div>
                  <div className="text-sm text-gray-600">Detailed quote sent within 2 hours</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600 mt-0.5">
                  4
                </div>
                <div>
                  <div className="font-medium">Book Service</div>
                  <div className="text-sm text-gray-600">Accept quote and schedule your service</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estimated Timeline */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Expected Quote Delivery</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              today
            </div>
            <div className="text-sm text-green-600 mt-1">We typically respond within 2 hours during business hours</div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard">View Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/book-now">Request Another Quote</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/support">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
