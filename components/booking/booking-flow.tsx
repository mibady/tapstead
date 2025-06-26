"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ServiceSelection } from "./service-selection"
import { BookingDetails } from "./booking-details"
import { QuoteRequestForm } from "./quote-request-form"
import { CustomerInfo } from "./customer-info"
import { BookingConfirmation } from "./booking-confirmation"
import { QuoteRequestConfirmation } from "./quote-request-confirmation"

const StripePaymentForm = lazy(() => import("./stripe-payment-form").then(module => ({ default: module.StripePaymentForm })))
import { Service } from "@/lib/services/service-data"
import { ServiceType } from "@/types/service-types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ErrorBoundary } from "@/components/ui/error-boundary"

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

// Add application-specific fields to the database Service type
type EnhancedService = Service & {
  serviceType: ServiceType;
  // Optional UI-specific fields that might be needed by components
  icon?: string;
  features?: string[];
  popular?: boolean;
  requiresAssessment?: boolean;
  emergencyAvailable?: boolean;
}

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<EnhancedService | null>(null)
  const [bookingData, setBookingData] = useState({
    service: null,
    details: null,
    customer: null,
    payment: null,
  })
  const [error, setError] = useState<string | null>(null)

  // Determine service type based on price and category
  const determineServiceType = (service: Service): ServiceType => {
    if (service.category?.toLowerCase().includes('emergency')) {
      return "emergency"
    } else if (service.base_price && service.base_price > 200) {
      return "quote-required"
    } else {
      return "bookable"
    }
  }

  const isQuoteRequired = selectedService ? 
    (selectedService.serviceType === "quote-required" || selectedService.serviceType === "emergency") : false
  
  const steps = isQuoteRequired ? quoteSteps : bookableSteps
  const maxSteps = steps.length
  const progress = ((currentStep - 1) / (maxSteps - 1)) * 100

  const handleNext = (data: any) => {
    try {
      setError(null)
      
      if (currentStep === 1) {
        // For service selection, enhance the service with serviceType
        const enhancedService = {
          ...data,
          serviceType: data.serviceType || determineServiceType(data)
        }
        setSelectedService(enhancedService)
        setBookingData((prev) => ({ ...prev, service: enhancedService }))
      } else {
        setBookingData((prev) => ({ ...prev, [getCurrentStepKey()]: data }))
      }

      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1)
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error("Error in booking flow:", err)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
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
          return <QuoteRequestForm 
            service={selectedService as any} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        } else {
          return <BookingDetails 
            onNext={handleNext} 
            onBack={handleBack} 
            service={selectedService as any} 
          />
        }
      case 3:
        return <CustomerInfo onNext={handleNext} onBack={handleBack} />
      case 4:
        if (isQuoteRequired) {
          return <QuoteRequestConfirmation bookingData={bookingData} />
        } else {
          return (
            <Suspense fallback={
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Loading Payment...</CardTitle>
                </CardHeader>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="h-12 bg-muted animate-pulse rounded" />
                    <div className="h-12 bg-muted animate-pulse rounded" />
                    <div className="h-12 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </Card>
            }>
              <StripePaymentForm onNext={handleNext} onBack={handleBack} bookingData={bookingData} />
            </Suspense>
          )
        }
      case 5:
        return <BookingConfirmation bookingData={bookingData} />
      default:
        return <ServiceSelection onNext={handleNext} />
    }
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <div className="font-medium">Error</div>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
    </ErrorBoundary>
  )
}
