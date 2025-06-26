import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProviderFormData, Reference } from "@/hooks/use-provider-form"

interface VerificationStepProps {
  formData: ProviderFormData
  onInputChange: (field: string, value: any) => void
  onReferenceChange: (index: number, field: keyof Reference, value: string) => void
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

export function VerificationStep({ formData, onInputChange, onReferenceChange }: VerificationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Verification & Documentation</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This information helps us verify your credentials and build trust with customers.
        </p>
      </div>

      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Insurance Information</CardTitle>
          <CardDescription>
            General liability insurance protects you and your customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasInsurance"
              checked={formData.hasInsurance}
              onCheckedChange={(checked) => onInputChange("hasInsurance", checked)}
            />
            <Label htmlFor="hasInsurance" className="font-normal cursor-pointer">
              I have general liability insurance
            </Label>
          </div>

          {formData.hasInsurance && (
            <div className="space-y-2">
              <Label htmlFor="insuranceAmount">Coverage Amount</Label>
              <Select 
                value={formData.insuranceAmount}
                onValueChange={(value) => onInputChange("insuranceAmount", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select coverage amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500k">$500,000</SelectItem>
                  <SelectItem value="1m">$1,000,000</SelectItem>
                  <SelectItem value="2m">$2,000,000</SelectItem>
                  <SelectItem value="other">Other amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* License Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Professional License</CardTitle>
          <CardDescription>
            Required for certain services like plumbing, electrical, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasLicense"
              checked={formData.hasLicense}
              onCheckedChange={(checked) => onInputChange("hasLicense", checked)}
            />
            <Label htmlFor="hasLicense" className="font-normal cursor-pointer">
              I have a professional license for my services
            </Label>
          </div>

          {formData.hasLicense && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="Enter license number"
                  value={formData.licenseNumber}
                  onChange={(e) => onInputChange("licenseNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseState">Issuing State</Label>
                <Select 
                  value={formData.licenseState}
                  onValueChange={(value) => onInputChange("licenseState", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Professional References</CardTitle>
          <CardDescription>
            Provide contact information for three professional references.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.references.map((reference, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium">Reference #{index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`ref-name-${index}`}>Full Name</Label>
                  <Input
                    id={`ref-name-${index}`}
                    placeholder="Reference name"
                    value={reference.name}
                    onChange={(e) => onReferenceChange(index, "name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`ref-phone-${index}`}>Phone Number</Label>
                  <Input
                    id={`ref-phone-${index}`}
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={reference.phone}
                    onChange={(e) => onReferenceChange(index, "phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`ref-relationship-${index}`}>Relationship</Label>
                  <Input
                    id={`ref-relationship-${index}`}
                    placeholder="Former employer, client, etc."
                    value={reference.relationship}
                    onChange={(e) => onReferenceChange(index, "relationship", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}