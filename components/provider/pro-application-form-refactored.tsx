"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { submitProviderApplication } from "@/lib/actions/provider-actions"
import { useProviderForm } from "@/hooks/use-provider-form"
import { FormProgress } from "./form-progress"
import { PersonalInfoStep } from "./form-steps/personal-info-step"
import { ExperienceStep } from "./form-steps/experience-step"
import { VerificationStep } from "./form-steps/verification-step"
import { ServicesStep } from "./form-steps/services-step"
import { ReviewStep } from "./form-steps/review-step"

export function ProApplicationFormRefactored() {
  const router = useRouter()
  const {
    formData,
    currentStep,
    loading,
    error,
    setLoading,
    setError,
    handleInputChange,
    handleReferenceChange,
    handleServiceToggle,
    nextStep,
    prevStep,
  } = useProviderForm()

  const handleSubmit = async () => {
    if (!formData.agreeToTerms || !formData.agreeToBackground) {
      setError("Please agree to all terms and conditions before submitting.")
      return
    }

    if (formData.selectedServices.length === 0) {
      setError("Please select at least one service category.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await submitProviderApplication(formData as any)
      
      if (result.success) {
        router.push("/become-pro/application/success")
      } else {
        setError(result.message || "Failed to submit application. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.address &&
          formData.city &&
          formData.state &&
          formData.zipCode
        )
      case 2:
        return formData.yearsExperience
      case 3:
        const validReferences = formData.references.filter(
          ref => ref.name && ref.phone && ref.relationship
        )
        return validReferences.length >= 1 // At least one valid reference
      case 4:
        return (
          formData.selectedServices.length > 0 &&
          formData.serviceAreas.length > 0 &&
          Object.values(formData.availability).some(day => day)
        )
      case 5:
        return formData.agreeToTerms && formData.agreeToBackground
      default:
        return false
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        )
      case 2:
        return (
          <ExperienceStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        )
      case 3:
        return (
          <VerificationStep
            formData={formData}
            onInputChange={handleInputChange}
            onReferenceChange={handleReferenceChange}
          />
        )
      case 4:
        return (
          <ServicesStep
            formData={formData}
            onServiceToggle={handleServiceToggle}
            onInputChange={handleInputChange}
          />
        )
      case 5:
        return (
          <ReviewStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Join Our Professional Network</h1>
        <p className="text-lg text-muted-foreground">
          Complete your application to start connecting with customers in your area.
        </p>
      </div>

      {/* Progress Indicator */}
      <FormProgress currentStep={currentStep} />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="sr-only">
            Application Step {currentStep}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceed() || loading}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Having trouble? Contact our support team at{" "}
          <a href="mailto:support@tapstead.com" className="text-primary hover:underline">
            support@tapstead.com
          </a>
        </p>
      </div>
    </div>
  )
}