"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, MapPin, Clock, CreditCard, Phone, Mail, Home } from "lucide-react"
import Link from "next/link"

interface BookingConfirmationProps {
  bookingData: any
}

export function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const service = bookingData.service
  const details = bookingData.details
  const customer = bookingData.customer
  const payment = bookingData.payment

  const bookingId = `TPS-${Date.now().toString().slice(-6)}`

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Booking Confirmed!</CardTitle>
          <CardDescription className="text-green-700">
            Your house cleaning service has been successfully booked
          </CardDescription>
          <div className="mt-4">
            <Badge className="bg-green-600 hover:bg-green-700 text-white">Booking ID: {bookingId}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-600" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">{service?.title}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Home Size</span>
                <span className="font-medium">{details?.houseSizeDetails?.label}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Frequency</span>
                <span className="font-medium">{details?.frequencyDetails?.label}</span>
              </div>

              {details?.addOnDetails?.length > 0 && (
                <div>
                  <div className="text-gray-600 mb-2">Add-on Services</div>
                  <div className="space-y-1">
                    {details.addOnDetails.map((addOn: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>• {addOn.name}</span>
                        <span>+${addOn.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Paid</span>
                  <span className="text-green-600">${details?.finalPrice}</span>
                </div>
              </div>
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
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">
                    {new Date(details?.scheduledDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-600">Service Date</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">{details?.scheduledTime}</div>
                  <div className="text-sm text-gray-600">Arrival Window</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">{details?.address}</div>
                  <div className="text-sm text-gray-600">Service Address</div>
                </div>
              </div>

              {details?.specialInstructions && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Special Instructions</div>
                  <div className="text-sm text-gray-600">{details.specialInstructions}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="font-medium">
                {customer?.firstName} {customer?.lastName}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{customer?.email}</span>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{customer?.phone}</span>
            </div>

            {customer?.emergencyContact?.name && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Emergency Contact</div>
                <div className="text-sm text-gray-600">
                  {customer.emergencyContact.name} - {customer.emergencyContact.phone}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">•••• •••• •••• {payment?.cardNumber?.slice(-4)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium text-sm">{payment?.transactionId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <Badge className="bg-green-100 text-green-800">Paid</Badge>
            </div>

            {details?.frequencyDetails?.id !== "one-time" && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">Recurring Service</div>
                <div className="text-sm text-blue-700">
                  Next billing:{" "}
                  {new Date(
                    Date.now() +
                      (details.frequencyDetails.id === "weekly"
                        ? 7
                        : details.frequencyDetails.id === "biweekly"
                          ? 14
                          : 30) *
                        24 *
                        60 *
                        60 *
                        1000,
                  ).toLocaleDateString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div className="font-medium mb-1">Confirmation Email</div>
              <div className="text-sm text-gray-600">You'll receive a confirmation email with all details</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div className="font-medium mb-1">Provider Assignment</div>
              <div className="text-sm text-gray-600">We'll assign a qualified cleaner within 2 hours</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div className="font-medium mb-1">Service Reminder</div>
              <div className="text-sm text-gray-600">We'll send reminders 24 hours before your service</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard">View Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/book-now">Book Another Service</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/support">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
