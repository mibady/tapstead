'use client'

import { useState, lazy, Suspense } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { format } from 'date-fns'

import CleaningPackageSelector from './CleaningPackageSelector'
import ContactForm from './ContactForm'
import SchedulingStep from './SchedulingStep'
import { FrequencyType, BedroomType, CleaningType } from '@/lib/booking/types'
import { calculatePrice, PRICING, ADD_ONS } from '@/lib/booking/pricing'

const StripePaymentForm = lazy(() => import('./StripeCheckoutButton'))

const bookableSteps = [
  { id: 1, title: "Select Package", description: "Choose your cleaning package" },
  { id: 2, title: "Schedule", description: "Pick a date & time" },
  { id: 3, title: "Details", description: "Contact information" },
  { id: 4, title: "Payment", description: "Review & pay" },
  { id: 5, title: "Confirmation", description: "All set!" },
]

interface BookingData {
  package?: {
    frequency: FrequencyType
    bedrooms: BedroomType
    cleaningType: CleaningType
  }
  schedule?: {
    date: Date
    time: string
  }
  contact?: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      apt?: string
      city: string
      state: string
      zip: string
    }
  }
}

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({})
  const [error, setError] = useState<string | null>(null)

  const progress = ((currentStep - 1) / (bookableSteps.length - 1)) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CleaningPackageSelector
            onSelect={(data) => {
              setBookingData((prev) => ({ ...prev, package: data }))
              setCurrentStep(2)
            }}
          />
        )
      case 2:
        return (
          <SchedulingStep
            onNext={(data) => {
              setBookingData((prev) => ({ ...prev, schedule: data }))
              setCurrentStep(3)
            }}
            onBack={() => setCurrentStep(1)}
          />
        )
      case 3:
        return (
          <ContactForm
            onNext={(data) => {
              setBookingData((prev) => ({ ...prev, contact: data }))
              setCurrentStep(4)
            }}
            onBack={() => setCurrentStep(2)}
          />
        )
      case 4:
        const pricing = bookingData.package ? calculatePrice({
          frequency: bookingData.package.frequency,
          bedrooms: bookingData.package.bedrooms,
          cleaningType: bookingData.package.cleaningType
        }) : null;

        return (
          <Card>
            <CardHeader>
              <CardTitle>Review and Pay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {bookingData.package && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Selected Package</h3>
                    <p>Frequency: {bookingData.package.frequency}</p>
                    <p>Home Size: {bookingData.package.bedrooms}</p>
                    <p>Cleaning Type: {bookingData.package.cleaningType}</p>
                    {pricing && (
                      <div className="mt-4 space-y-1">
                        <p>Base Price: ${pricing.base}</p>
                        {pricing.addOns > 0 && <p>Add-ons: +${pricing.addOns}</p>}
                        <p className="font-semibold">Total: ${pricing.total}</p>
                      </div>
                    )}
                  </div>
                )}

                {bookingData.schedule && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Appointment</h3>
                    <p>Date: {format(bookingData.schedule.date, 'PPP')}</p>
                    <p>Time: {format(new Date(bookingData.schedule.time), 'h:mm a')}</p>
                  </div>
                )}

                {bookingData.contact && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Contact Information</h3>
                    <p>{bookingData.contact.name}</p>
                    <p>{bookingData.contact.email}</p>
                    <p>{bookingData.contact.phone}</p>
                    <p>
                      {bookingData.contact.address.street}
                      {bookingData.contact.address.apt && `, ${bookingData.contact.address.apt}`}
                      <br />
                      {bookingData.contact.address.city}, {bookingData.contact.address.state}{' '}
                      {bookingData.contact.address.zip}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
              <Suspense fallback={<Button disabled>Loading...</Button>}>
                <StripePaymentForm
                  lineItems={pricing ? [
                    {
                      amount: pricing.total * 100,
                      currency: 'usd',
                      name: `${bookingData.package!.bedrooms} Home - ${bookingData.package!.frequency} Cleaning`,
                      description: `A ${bookingData.package!.cleaningType} cleaning service.`,
                      quantity: 1
                    },
                    ...((bookingData.package!.cleaningType === 'deep' || bookingData.package!.cleaningType === 'moveInOut') ? [
                      {
                        price_data: {
                          currency: 'usd',
                          product_data: {
                            name: bookingData.package!.cleaningType === 'deep' ? 
                              'Deep Cleaning Add-on' : 
                              'Move In/Out Add-on',
                            description: `Additional service for ${bookingData.package!.bedrooms} home`,
                            metadata: {
                              productId: bookingData.package!.cleaningType === 'deep' ? 
                                ADD_ONS.deepClean.productId : 
                                ADD_ONS.moveInOut.productId
                            }
                          },
                          unit_amount: bookingData.package!.cleaningType === 'deep' ?
                            ADD_ONS.deepClean.price * 100 :
                            ADD_ONS.moveInOut.price * 100
                        },
                        quantity: 1
                      }
                    ] : [])
                  ] : []}
                  metadata={{
                    frequency: String(bookingData.package!.frequency),
                    bedrooms: String(bookingData.package!.bedrooms),
                    cleaningType: String(bookingData.package!.cleaningType),
                    date: String(bookingData.schedule!.date.toISOString()),
                    time: String(bookingData.schedule!.time),
                    contactName: String(bookingData.contact!.name),
                    contactEmail: String(bookingData.contact!.email),
                    contactPhone: String(bookingData.contact!.phone),
                    address: JSON.stringify(bookingData.contact!.address),
                  }}
                  onSuccess={() => setCurrentStep(5)}
                />
              </Suspense>
            </CardFooter>
          </Card>
        )
      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg mb-4">
                Thank you for booking with us. A confirmation email has been sent to{' '}
                {bookingData.contact?.email}.
              </p>
              <Button onClick={() => window.location.href = '/dashboard'}>
                View My Bookings
              </Button>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 max-w-4xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <div className="font-medium">Error</div>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl">Book Your Cleaning Service</CardTitle>
              <Badge variant="secondary">
                Step {currentStep} of {bookableSteps.length}
              </Badge>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="grid grid-cols-5 gap-2">
              {bookableSteps.map((step) => (
                <div
                  key={step.id}
                  className={`text-center ${
                    step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        {renderStepContent()}
      </div>
    </ErrorBoundary>
  )
}