"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Clock, Phone, MessageCircle, CheckCircle, Truck, Wrench, Star } from "lucide-react"

interface BookingTrackerProps {
  booking: any
  tracking: any
}

export function BookingTracker({ booking, tracking }: BookingTrackerProps) {
  const getStatusProgress = (status: string) => {
    switch (status) {
      case "confirmed":
        return 25
      case "en-route":
        return 50
      case "arrived":
        return 75
      case "in-progress":
        return 85
      case "completed":
        return 100
      default:
        return 0
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return CheckCircle
      case "en-route":
        return Truck
      case "arrived":
        return MapPin
      case "in-progress":
        return Wrench
      case "completed":
        return CheckCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "en-route":
        return "bg-yellow-100 text-yellow-800"
      case "arrived":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const StatusIcon = getStatusIcon(tracking?.status || booking?.status)
  const progress = getStatusProgress(tracking?.status || booking?.status)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Track Your Service</h1>
        <p className="text-gray-600">Real-time updates for your {booking?.services?.title}</p>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Booking #{booking?.id?.slice(-8)}</CardDescription>
              </div>
            </div>
            <Badge className={getStatusColor(tracking?.status || booking?.status)}>
              {(tracking?.status || booking?.status)?.replace("-", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className={`p-3 rounded-lg ${progress >= 25 ? "bg-blue-50" : "bg-gray-50"}`}>
              <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${progress >= 25 ? "text-blue-600" : "text-gray-400"}`} />
              <div className="text-sm font-medium">Confirmed</div>
            </div>
            <div className={`p-3 rounded-lg ${progress >= 50 ? "bg-blue-50" : "bg-gray-50"}`}>
              <Truck className={`h-6 w-6 mx-auto mb-2 ${progress >= 50 ? "text-blue-600" : "text-gray-400"}`} />
              <div className="text-sm font-medium">En Route</div>
            </div>
            <div className={`p-3 rounded-lg ${progress >= 75 ? "bg-blue-50" : "bg-gray-50"}`}>
              <MapPin className={`h-6 w-6 mx-auto mb-2 ${progress >= 75 ? "text-blue-600" : "text-gray-400"}`} />
              <div className="text-sm font-medium">Arrived</div>
            </div>
            <div className={`p-3 rounded-lg ${progress >= 100 ? "bg-green-50" : "bg-gray-50"}`}>
              <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${progress >= 100 ? "text-green-600" : "text-gray-400"}`} />
              <div className="text-sm font-medium">Completed</div>
            </div>
          </div>

          {tracking?.estimated_arrival && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-medium text-blue-900">Estimated Arrival</div>
                  <div className="text-blue-700">{new Date(tracking.estimated_arrival).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium">{booking?.services?.title}</div>
              <div className="text-sm text-gray-600">{booking?.services?.category}</div>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {new Date(booking?.scheduled_date).toLocaleDateString()} at {booking?.scheduled_time}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {booking?.address}
            </div>

            <div className="text-sm text-gray-600">
              <div className="font-medium mb-1">Duration:</div>
              {booking?.services?.duration}
            </div>

            {booking?.special_instructions && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-sm mb-1">Special Instructions</div>
                <div className="text-sm text-gray-600">{booking.special_instructions}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Provider Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Service Professional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking?.providers ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{booking.providers.business_name}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {booking.providers.rating} rating
                    </div>
                  </div>
                  <Badge variant="secondary">Verified Pro</Badge>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>

                {tracking?.notes && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-sm text-blue-900 mb-1">Latest Update</div>
                    <div className="text-sm text-blue-700">{tracking.notes}</div>
                    <div className="text-xs text-blue-600 mt-1">{new Date(tracking.updated_at).toLocaleString()}</div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-600">Professional will be assigned soon</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Map (Placeholder) */}
      {tracking?.location_lat && tracking?.location_lng && (
        <Card>
          <CardHeader>
            <CardTitle>Live Location</CardTitle>
            <CardDescription>Track your service professional in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <div className="text-gray-600">Live map integration</div>
                <div className="text-sm text-gray-500">
                  Lat: {tracking.location_lat}, Lng: {tracking.location_lng}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
