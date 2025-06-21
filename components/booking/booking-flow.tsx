"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ServiceSelection } from "./service-selection"
import { BookingDetails } from "./booking-details"
import { QuoteRequestForm } from "./quote-request-form"
import { CustomerInfo } from "./customer-info"
import { PaymentInfo } from "./payment-info"
import { BookingConfirmation } from "./booking-confirmation"
import { QuoteRequestConfirmation } from "./quote-request-confirmation"
import type { Service } from "@/types/service-types"

const bookableSteps = [
  { id: 1, title: "Select Service", description: "Choose what you need done" },
  { id: 2, title: "Details", description: "When and where" },
  { id: 3, title: "Your Info", description: "Contact information" },
  { id: 4, title: "Payment", description: "Secure checkout" },
  { id: 5, title: "Confirmation", description: "You're all set!" },
]

const quoteSteps = [
  { id: 1, title: "Select Service", description: "Choose what you need done" },
  { id: 2, title: "Project Details", description: "Tell us about your project" },
  { id: 3, title: "Your Info", description: "Contact information" },
  { id: 4, title: "Confirmation", description: "Quote request submitted!" },
]

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [bookingData, setBookingData] = useState({
    service: null,
    details: null,
    customer: null,
    payment: null,
  })

  const isQuoteRequired =
    selectedService?.serviceType === "quote-required" || selectedService?.serviceType === "emergency"
  const steps = isQuoteRequired ? quoteSteps : bookableSteps
  const maxSteps = steps.length
  const progress = ((currentStep - 1) / (maxSteps - 1)) * 100

  const handleNext = (data: any) => {
    if (currentStep === 1) {
      setSelectedService(data)
    }

    setBookingData((prev) => ({ ...prev, [getCurrentStepKey()]: data }))

    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getCurrentStepKey = () => {
    switch (currentStep) {
      case 1:
        return "service"
      case 2:
        return "details"
      case 3:
        return "customer"
      case 4:
        return "payment"
      default:
        return "service"
    }
  }

  const renderStepContent = () => {
    if (!selectedService && currentStep > 1) {
      return <ServiceSelection onNext={handleNext} />
    }

    switch (currentStep) {
      case 1:
        return <ServiceSelection onNext={handleNext} />
      case 2:
        if (isQuoteRequired) {
          return <QuoteRequestForm service={selectedService!} onNext={handleNext} onBack={handleBack} />
        } else {
          return <BookingDetails onNext={handleNext} onBack={handleBack} service={selectedService} />
        }
      case 3:
        return <CustomerInfo onNext={handleNext} onBack={handleBack} />
      case 4:
        if (isQuoteRequired) {
          return <QuoteRequestConfirmation bookingData={bookingData} />
        } else {
          return <PaymentInfo onNext={handleNext} onBack={handleBack} bookingData={bookingData} />
        }
      case 5:
        return <BookingConfirmation bookingData={bookingData} />
      default:
        return <ServiceSelection onNext={handleNext} />
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Progress Header */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">{isQuoteRequired ? "Request Quote" : "Book Your Service"}</CardTitle>
            <Badge variant="secondary">
              Step {currentStep} of {maxSteps}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className={`grid gap-2 ${maxSteps === 4 ? "grid-cols-4" : "grid-cols-5"}`}>
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-center ${step.id <= currentStep ? "text-blue-600" : "text-gray-400"}`}
              >
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs">{step.description}</div>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  )
}
