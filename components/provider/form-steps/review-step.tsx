import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProviderFormData } from "@/hooks/use-provider-form"
import { serviceCategories } from "@/data/service-categories"

interface ReviewStepProps {
  formData: ProviderFormData
  onInputChange: (field: string, value: any) => void
}

export function ReviewStep({ formData, onInputChange }: ReviewStepProps) {
  const selectedServiceNames = formData.selectedServices
    .map(id => serviceCategories.find(s => s.id === id)?.name)
    .filter(Boolean)

  const availableDays = Object.entries(formData.availability)
    .filter(([_, available]) => available)
    .map(([day, _]) => day.charAt(0).toUpperCase() + day.slice(1))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please review your information and agree to our terms before submitting your application.
        </p>
      </div>

      {/* Personal Information Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {formData.phone}
            </div>
            <div>
              <span className="font-medium">Location:</span> {formData.city}, {formData.state} {formData.zipCode}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Experience:</span> {formData.yearsExperience} years
          </div>
          {formData.businessName && (
            <div>
              <span className="font-medium">Business:</span> {formData.businessName}
            </div>
          )}
          {formData.militaryVeteran && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Military Veteran</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Services & Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-medium text-sm">Selected Services:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedServiceNames.map((name) => (
                <Badge key={name} variant="outline">{name}</Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="font-medium text-sm">Service Areas:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.serviceAreas.map((area) => (
                <Badge key={area} variant="secondary">{area}</Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="font-medium text-sm">Available Days:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableDays.map((day) => (
                <Badge key={day} variant="outline">{day}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Verification Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Insurance:</span>
            {formData.hasInsurance ? (
              <Badge variant="default">✓ {formData.insuranceAmount} coverage</Badge>
            ) : (
              <Badge variant="secondary">Not provided</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">License:</span>
            {formData.hasLicense ? (
              <Badge variant="default">✓ Licensed ({formData.licenseState})</Badge>
            ) : (
              <Badge variant="secondary">Not required</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">References:</span>
            <Badge variant="outline">
              {formData.references.filter(ref => ref.name && ref.phone).length} provided
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Terms and Agreements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Terms & Agreements</CardTitle>
          <CardDescription>
            Please read and agree to the following terms before submitting your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => onInputChange("agreeToTerms", checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="agreeToTerms" className="font-normal cursor-pointer">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeToBackground"
              checked={formData.agreeToBackground}
              onCheckedChange={(checked) => onInputChange("agreeToBackground", checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="agreeToBackground" className="font-normal cursor-pointer">
                I consent to a background check and understand that approval is contingent 
                on passing verification requirements
              </Label>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Next Steps:</strong> After submitting your application, we'll review your 
              information and contact you within 2-3 business days. If approved, you'll receive 
              access to our provider dashboard and can start receiving job requests.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}