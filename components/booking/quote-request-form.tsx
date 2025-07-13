"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Upload, MapPin, DollarSign, Clock, Camera } from "lucide-react"
import type { Service } from "@/types/service-types"

interface QuoteRequestFormProps {
  service: Service
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
    propertyType: "",
    propertySize: "",
  })

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

  const propertyTypes = ["Single Family Home", "Townhouse", "Condo/Apartment", "Commercial Property", "Other"]

  const propertySizes = [
    "Small (< 1,500 sq ft)",
    "Medium (1,500 - 2,500 sq ft)",
    "Large (2,500 - 4,000 sq ft)",
    "Extra Large (> 4,000 sq ft)",
  ]

  const budgetRanges = [
    "Under $200",
    "$200 - $500",
    "$500 - $1,000",
    "$1,000 - $2,500",
    "$2,500 - $5,000",
    "Over $5,000",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }))
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    onNext({
      ...formData,
      serviceType: "quote-required",
      service: service,
    })
  }

  const isFormValid = formData.projectDetails && formData.address && formData.preferredDate

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <service.icon className="w-5 h-5 mr-2 text-blue-600" />
            {service.title} - Request Custom Quote
          </CardTitle>
          <CardDescription>
            Tell us about your project so we can provide an accurate quote within 2 hours
          </CardDescription>
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
                  placeholder={`Tell us about your ${service.title.toLowerCase()} project. Include size, materials, specific requirements, current condition, timeline, etc.`}
                  value={formData.projectDetails}
                  onChange={(e) => handleInputChange("projectDetails", e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleInputChange("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="propertySize">Property Size</Label>
                  <Select
                    value={formData.propertySize}
                    onValueChange={(value) => handleInputChange("propertySize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property size" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertySizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                    {budgetRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
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
                <Camera className="w-4 h-4 mr-2" />
                Project Photos (Recommended)
              </CardTitle>
              <CardDescription>
                Photos help us provide more accurate quotes. Include current condition, area size, materials, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop photos here, or click to select</p>
                <p className="text-xs text-gray-500 mb-4">Max 10MB per image, up to 10 images</p>
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
                  <p className="text-sm font-medium mb-2">Uploaded Photos ({formData.photos.length}):</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {formData.photos.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="bg-gray-100 rounded-lg p-2 text-center">
                          <div className="text-xs text-gray-600 truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)}MB</div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
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
                    <div className="font-medium text-sm">AI Analysis</div>
                    <div className="text-xs text-gray-600">Smart quote generation</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-sm">Receive Quote</div>
                    <div className="text-xs text-gray-600">Detailed quote within 2 hours</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                    4
                  </div>
                  <div>
                    <div className="font-medium text-sm">Book Service</div>
                    <div className="text-xs text-gray-600">Accept quote and schedule</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-2 text-green-500" />
                    <span>Quotes delivered within 2 hours</span>
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
                  ${service.priceRange?.min} - ${service.priceRange?.max}
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
  )
}
