"use client"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { BookingFlow } from "@/components/booking/booking-flow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Shield, Star } from "lucide-react"

export default function BookNowPage() {
  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Service</h1>
            <p className="text-xl text-gray-600 mb-8">
              Get started in just 60 seconds. Professional service, guaranteed results.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">60-Second Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Booking Flow */}
          <div className="max-w-4xl mx-auto">
            <BookingFlow />
          </div>

          {/* Additional Info */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instant Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get immediate confirmation and service provider details after booking.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Flexible Scheduling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Choose from available time slots that work with your schedule.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Satisfaction Guaranteed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">100% satisfaction guarantee or we'll make it right at no extra cost.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
