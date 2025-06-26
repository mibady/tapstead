"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, Upload, MapPin, DollarSign, Clock, Wrench, AlertCircle } from "lucide-react"
import { Service } from "@/lib/services/service-data"
import { ServiceType } from "@/types/service-types"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { QuoteRequestFormSkeleton } from "@/components/ui/skeleton-loaders"

interface QuoteRequestFormProps {
  service: Service & { serviceType?: ServiceType, icon?: any }
  onNext: (data: any) => void
  onBack: () => void
}

export function QuoteRequestForm({ service, onNext, onBack }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState({
    projectDetails: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    estimatedBudget: "",
    urgency: "standard",
    photos: [] as File[],
    contactPreference: "email",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const urgencyOptions = [
    { value: "standard", label: "Standard (3-5 days)", multiplier: 1.0 },
    { value: "priority", label: "Priority (1-2 days)", multiplier: 1.15 },
    { value: "urgent", label: "Urgent (Same day)", multiplier: 1.3 },
  ]

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
    "Flexible",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }))
  }

  const handleSubmit = () => {
    try {
      setIsLoading(true)
      setErrorMsg(null)
      
      // Validate form data
      if (!formData.projectDetails) {
        throw new Error("Please provide project details")
      }
      
      if (!formData.address) {
        throw new Error("Please provide a project address")
      }
      
      if (!formData.preferredDate) {
        throw new Error("Please select a preferred date")
      }
      
      // Process form submission
      onNext({
        ...formData,
        serviceType: "quote-required",
        service: service,
      })
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error("Error in quote request form:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.projectDetails && formData.address && formData.preferredDate

  // Show skeleton loader during loading state
  if (isLoading) {
    return (
      <ErrorBoundary>
        <QuoteRequestFormSkeleton />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {errorMsg && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {service.icon ? (
              <service.icon className="w-5 h-5 mr-2 text-blue-600" />
            ) : (
              <Wrench className="w-5 h-5 mr-2 text-blue-600" />
            )}
            {service.title} - Request Quote
          </CardTitle>
          <CardDescription>Tell us about your project so we can provide an accurate quote</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
              <CardDescription>The more details you provide, the more accurate your quote will be</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectDetails">Describe your project *</Label>
                <Textarea
                  id="projectDetails"
                  placeholder={`Tell us about your ${service.title?.toLowerCase() || 'project'}. Include size, materials, specific requirements, current condition, etc.`}
                  value={formData.projectDetails}
                  onChange={(e) => handleInputChange("projectDetails", e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="estimatedBudget">Estimated Budget (Optional)</Label>
                <Select
                  value={formData.estimatedBudget}
                  onValueChange={(value) => handleInputChange("estimatedBudget", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500">Under $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                    <SelectItem value="over-5000">Over $5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location & Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-4 h-4 mr-2" />
                Location & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Project Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State 12345"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDate">Preferred Start Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(value) => handleInputChange("preferredTime", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">Project Urgency</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          {option.multiplier > 1 && (
                            <Badge variant="secondary" className="ml-2">
                              Rush +{Math.round((option.multiplier - 1) * 100)}%
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Upload className="w-4 h-4 mr-2" />
                Project Photos (Optional)
              </CardTitle>
              <CardDescription>
                Photos help us provide more accurate quotes. Include current condition, area size, materials, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop photos here, or click to select</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    Choose Photos
                  </label>
                </Button>
              </div>

              {formData.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Uploaded Photos:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.photos.map((file, index) => (
                      <Badge key={index} variant="secondary">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quote Info Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="w-4 h-4 mr-2" />
                Quote Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-sm">Submit Request</div>
                    <div className="text-xs text-gray-600">Provide project details</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-sm">Professional Review</div>
                    <div className="text-xs text-gray-600">Expert assesses your project</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-sm">Receive Quote</div>
                    <div className="text-xs text-gray-600">Detailed quote within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                    4
                  </div>
                  <div>
                    <div className="font-medium text-sm">Book Instantly</div>
                    <div className="text-xs text-gray-600">Accept quote and schedule service</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-2 text-green-500" />
                    <span>Quotes delivered within 24 hours</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary" className="text-xs">
                      No obligation
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">Estimated Range</div>
                <div className="text-lg font-semibold text-blue-600">
                  ${Math.round((service.base_price || 100) * 0.8)} - ${Math.round((service.base_price || 100) * 1.5)}
                </div>
                <div className="text-xs text-blue-600">Based on similar projects</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!isFormValid} className="bg-blue-600 hover:bg-blue-700">
          Submit Quote Request
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      </div>
    </ErrorBoundary>
  )
}
