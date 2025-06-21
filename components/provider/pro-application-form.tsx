"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Briefcase, Shield, FileText, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { submitProviderApplication } from "@/lib/actions/provider-actions"

const steps = [
  { id: 1, title: "Personal Info", icon: User, description: "Basic information" },
  { id: 2, title: "Experience", icon: Briefcase, description: "Professional background" },
  { id: 3, title: "Verification", icon: Shield, description: "Documents & references" },
  { id: 4, title: "Services", icon: FileText, description: "What you offer" },
  { id: 5, title: "Review", icon: CheckCircle, description: "Submit application" },
]

const serviceCategories = [
  { id: "cleaning", name: "House Cleaning", baseRate: "$25-35/hr" },
  { id: "handyman", name: "Handyman Services", baseRate: "$35-50/hr" },
  { id: "plumbing", name: "Plumbing", baseRate: "$75-125/hr" },
  { id: "electrical", name: "Electrical", baseRate: "$85-150/hr" },
  { id: "painting", name: "Painting", baseRate: "$30-45/hr" },
  { id: "junk-removal", name: "Junk Removal", baseRate: "$40-60/hr" },
  { id: "pressure-washing", name: "Pressure Washing", baseRate: "$35-55/hr" },
  { id: "gutter-services", name: "Gutter Services", baseRate: "$40-65/hr" },
  { id: "welding", name: "Welding Services", baseRate: "$65-95/hr" },
  { id: "fire-debris", name: "Fire Debris Removal", baseRate: "$45-75/hr" },
]

export function ProApplicationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Experience
    businessName: "",
    yearsExperience: "",
    previousWork: "",
    specializations: "",
    militaryVeteran: false,

    // Verification
    hasInsurance: false,
    insuranceAmount: "",
    hasLicense: false,
    licenseNumber: "",
    licenseState: "",
    references: [
      { name: "", phone: "", relationship: "" },
      { name: "", phone: "", relationship: "" },
      { name: "", phone: "", relationship: "" },
    ],

    // Services
    selectedServices: [] as string[],
    serviceAreas: [] as string[],
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },

    // Legal
    agreeToTerms: false,
    agreeToBackground: false,
  })

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleReferenceChange = (index: number, field: string, value: string) => {
    const newReferences = [...formData.references]
    newReferences[index] = { ...newReferences[index], [field]: value }
    setFormData((prev) => ({ ...prev, references: newReferences }))
  }

  const handleServiceToggle = (serviceId: string) => {
    const newServices = formData.selectedServices.includes(serviceId)
      ? formData.selectedServices.filter((id) => id !== serviceId)
      : [...formData.selectedServices, serviceId]
    setFormData((prev) => ({ ...prev, selectedServices: newServices }))
  }

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availability: { ...prev.availability, [day]: checked },
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await submitProviderApplication(formData)
      if (result.success) {
        router.push("/become-pro/application/success")
      } else {
        setError(result.error || "Failed to submit application")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 2:
        return formData.yearsExperience && formData.previousWork
      case 3:
        return formData.hasInsurance && formData.references[0].name && formData.references[1].name
      case 4:
        return formData.selectedServices.length > 0
      case 5:
        return formData.agreeToTerms && formData.agreeToBackground
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Your City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="CA"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="12345"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessName">Business Name (if applicable)</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Smith Home Services"
              />
            </div>

            <div>
              <Label htmlFor="yearsExperience">Years of Professional Experience *</Label>
              <Select
                value={formData.yearsExperience}
                onValueChange={(value) => handleInputChange("yearsExperience", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10-15">10-15 years</SelectItem>
                  <SelectItem value="15+">15+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="previousWork">Describe Your Previous Work Experience *</Label>
              <Textarea
                id="previousWork"
                value={formData.previousWork}
                onChange={(e) => handleInputChange("previousWork", e.target.value)}
                placeholder="Tell us about your professional background, types of projects you've worked on, and any relevant experience..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="specializations">Special Skills or Certifications</Label>
              <Textarea
                id="specializations"
                value={formData.specializations}
                onChange={(e) => handleInputChange("specializations", e.target.value)}
                placeholder="List any special skills, certifications, or areas of expertise..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="militaryVeteran"
                checked={formData.militaryVeteran}
                onCheckedChange={(checked) => handleInputChange("militaryVeteran", checked)}
              />
              <Label htmlFor="militaryVeteran" className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-blue-600" />I am a military veteran (Priority consideration)
              </Label>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasInsurance"
                  checked={formData.hasInsurance}
                  onCheckedChange={(checked) => handleInputChange("hasInsurance", checked)}
                />
                <Label htmlFor="hasInsurance">I have general liability insurance *</Label>
              </div>

              {formData.hasInsurance && (
                <div>
                  <Label htmlFor="insuranceAmount">Insurance Coverage Amount</Label>
                  <Select
                    value={formData.insuranceAmount}
                    onValueChange={(value) => handleInputChange("insuranceAmount", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coverage amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500k">$500,000</SelectItem>
                      <SelectItem value="1m">$1,000,000</SelectItem>
                      <SelectItem value="2m">$2,000,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLicense"
                  checked={formData.hasLicense}
                  onCheckedChange={(checked) => handleInputChange("hasLicense", checked)}
                />
                <Label htmlFor="hasLicense">I have professional licenses/certifications</Label>
              </div>

              {formData.hasLicense && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      placeholder="License #"
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseState">Issuing State</Label>
                    <Input
                      id="licenseState"
                      value={formData.licenseState}
                      onChange={(e) => handleInputChange("licenseState", e.target.value)}
                      placeholder="CA"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-4">Professional References (3 required) *</h4>
              {formData.references.map((ref, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Reference {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={ref.name}
                          onChange={(e) => handleReferenceChange(index, "name", e.target.value)}
                          placeholder="Reference name"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={ref.phone}
                          onChange={(e) => handleReferenceChange(index, "phone", e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Input
                        value={ref.relationship}
                        onChange={(e) => handleReferenceChange(index, "relationship", e.target.value)}
                        placeholder="Former client, employer, etc."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Select Services You Provide *</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {serviceCategories.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${
                      formData.selectedServices.includes(service.id)
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-green-600">{service.baseRate}</div>
                        </div>
                        <Checkbox checked={formData.selectedServices.includes(service.id)} readOnly />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Availability</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.availability).map(([day, available]) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={available}
                      onCheckedChange={(checked) => handleAvailabilityChange(day, !!checked)}
                    />
                    <Label htmlFor={day} className="capitalize">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Application Summary</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <strong>Email:</strong> {formData.email}
                </div>
                <div>
                  <strong>Experience:</strong> {formData.yearsExperience}
                </div>
                <div>
                  <strong>Services:</strong> {formData.selectedServices.length} selected
                </div>
                <div>
                  <strong>Insurance:</strong> {formData.hasInsurance ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Military Veteran:</strong> {formData.militaryVeteran ? "Yes" : "No"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the Tapstead Pro Terms of Service and understand the service standards required *
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToBackground"
                  checked={formData.agreeToBackground}
                  onCheckedChange={(checked) => handleInputChange("agreeToBackground", checked)}
                />
                <Label htmlFor="agreeToBackground" className="text-sm">
                  I consent to background check, reference verification, and insurance validation *
                </Label>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Progress Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">Tapstead Pro Application</CardTitle>
            <Badge variant="secondary">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-center ${step.id <= currentStep ? "text-blue-600" : "text-gray-400"}`}
              >
                <div className="flex items-center justify-center mb-1">
                  <step.icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-medium">{step.title}</div>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 mr-2" })}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8 mb-16">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={handleNext} disabled={!isStepValid()} className="bg-blue-600 hover:bg-blue-700">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isStepValid() || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Submit Application"}
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
