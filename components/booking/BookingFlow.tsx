import React, { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import ServiceSelector from './ServiceSelector'
import OnlineBookingForm from './OnlineBookingForm'
import QuoteRequestForm from './QuoteRequestForm'
import { services } from '@/lib/booking/services'
import { Service } from '@/lib/booking/services'

const cleaningSteps = [
  { id: 1, title: "Select Service", description: "Choose your cleaning service" },
  { id: 2, title: "Service Details", description: "Home size and preferences" },
  { id: 3, title: "Date & Time", description: "When to clean" },
  { id: 4, title: "Address", description: "Where to clean" },
  { id: 5, title: "Contact Info", description: "Your information" },
  { id: 6, title: "Special Instructions", description: "Final details" },
  { id: 7, title: "Payment", description: "Secure checkout" },
  { id: 8, title: "Confirmation", description: "You're all set!" },
]

const quoteSteps = [
  { id: 1, title: "Select Service", description: "Choose your service" },
  { id: 2, title: "Project Details", description: "Describe your needs" },
  { id: 3, title: "Contact Info", description: "Your information" },
  { id: 4, title: "Confirmation", description: "Quote request submitted!" },
]

export default function BookingFlow() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const isInstantBooking = selectedService?.bookingType === 'instant'
  const steps = isInstantBooking ? cleaningSteps : quoteSteps
  const maxSteps = steps.length
  const progress = ((step - 1) / (maxSteps - 1)) * 100

  function next(data?: any) {
    // store form data in state or context
    setStep(prev => prev + 1)
  }

  function back() {
    setStep(prev => prev - 1)
  }

  function handleSelect(svc: Service) {
    setSelectedService(svc)
    next()
  }

  if (step === 1) {
    return <ServiceSelector services={services} onSelect={handleSelect} />
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Progress Header */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">
              {isInstantBooking ? "Book Your Home Cleaning" : "Request a Free Quote"}
            </CardTitle>
            <Badge variant="secondary">
              Step {step} of {maxSteps}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className={`grid gap-2 ${maxSteps === 4 ? "grid-cols-4" : "grid-cols-4 lg:grid-cols-8"}`}>
            {steps.map((stepInfo) => (
              <div
                key={stepInfo.id}
                className={`text-center ${stepInfo.id <= step ? "text-blue-600" : "text-gray-400"}`}
              >
                <div className="text-sm font-medium">{stepInfo.title}</div>
                <div className="text-xs hidden lg:block">{stepInfo.description}</div>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      {isInstantBooking && step > 1 && step <= 7 && (
        <OnlineBookingForm step={step} onNext={next} onBack={back} />
      )}

      {!isInstantBooking && step > 1 && step <= 4 && (
        <QuoteRequestForm step={step} onNext={next} onBack={back} service={selectedService} />
      )}

      {/* Final confirmation pages */}
      {((isInstantBooking && step === 8) || (!isInstantBooking && step === 4)) && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              {isInstantBooking ? "Booking Confirmed!" : "Quote Request Submitted!"}
            </CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
