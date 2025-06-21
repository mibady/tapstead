"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, MapPin, Calendar, Clock, DollarSign } from "lucide-react"

interface BookingDetailsProps {
  onNext: (data: any) => void
  onBack: () => void
  service: any
}

export function BookingDetails({ onNext, onBack, service }: BookingDetailsProps) {
  const [formData, setFormData] = useState({
    address: "",
    date: "",
    time: "",
    specialInstructions: "",
    homeSize: "",
    urgency: "standard",
  })

  const [estimatedPrice, setEstimatedPrice] = useState(service?.basePrice || 0)

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ]

  const homeSizes = [
    { value: "studio", label: "Studio/1BR", multiplier: 0.8 },
    { value: "2br", label: "2-3 Bedrooms", multiplier: 1.0 },
    { value: "4br", label: "4-5 Bedrooms", multiplier: 1.3 },
    { value: "large", label: "6+ Bedrooms", multiplier: 1.6 },
  ]

  const urgencyOptions = [
    { value: "standard", label: "Standard (2-3 days)", multiplier: 1.0 },
    { value: "priority", label: "Priority (Next day)", multiplier: 1.15 },
    { value: "urgent", label: "Urgent (Same day)", multiplier: 1.3 },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Update price based on selections
    let newPrice = service?.basePrice || 0

    if (field === "homeSize" || (field !== "homeSize" && formData.homeSize)) {
      const sizeMultiplier =
        homeSizes.find((s) => s.value === (field === "homeSize" ? value : formData.homeSize))?.multiplier || 1
      newPrice *= sizeMultiplier
    }

    if (field === "urgency" || (field !== "urgency" && formData.urgency)) {
      const urgencyMultiplier =
        urgencyOptions.find((u) => u.value === (field === "urgency" ? value : formData.urgency))?.multiplier || 1
      newPrice *= urgencyMultiplier
    }

    setEstimatedPrice(Math.round(newPrice))
  }

  const handleContinue = () => {
    onNext({ ...formData, estimatedPrice })
  }

  const isFormValid = formData.address && formData.date && formData.time && formData.homeSize

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <service.icon className="w-5 h-5 mr-2 text-blue-600" />
            {service.title} - Booking Details
          </CardTitle>
          <CardDescription>Tell us when and where you need the service</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-4 h-4 mr-2" />
                Service Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State 12345"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="homeSize">Home Size</Label>
                  <Select value={formData.homeSize} onValueChange={(value) => handleInputChange("homeSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your home size" />
                    </SelectTrigger>
                    <SelectContent>
                      {homeSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-4 h-4 mr-2" />
                When do you need this done?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
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

              <div className="mt-4">
                <Label htmlFor="urgency">Service Priority</Label>
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
                              +{Math.round((option.multiplier - 1) * 100)}%
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

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Special Instructions</CardTitle>
              <CardDescription>Any specific details or requests for your service professional</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Please focus on the kitchen and bathrooms, use eco-friendly products only, pet-friendly home..."
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="w-4 h-4 mr-2" />
                Price Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>${service?.basePrice}</span>
                </div>

                {formData.homeSize && (
                  <div className="flex justify-between text-sm">
                    <span>Home Size Adjustment</span>
                    <span>
                      {homeSizes.find((s) => s.value === formData.homeSize)?.multiplier === 1
                        ? "Included"
                        : `×${homeSizes.find((s) => s.value === formData.homeSize)?.multiplier}`}
                    </span>
                  </div>
                )}

                {formData.urgency !== "standard" && (
                  <div className="flex justify-between text-sm">
                    <span>Priority Service</span>
                    <span>
                      +{Math.round((urgencyOptions.find((u) => u.value === formData.urgency)?.multiplier! - 1) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Estimate</span>
                  <span className="text-green-600">${estimatedPrice}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Final price confirmed before service</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Estimated duration: {service?.duration}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="text-xs">
                    All materials included
                  </Badge>
                </div>
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
        <Button onClick={handleContinue} disabled={!isFormValid} className="bg-blue-600 hover:bg-blue-700">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
