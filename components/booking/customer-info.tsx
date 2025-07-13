"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Phone, Mail, ArrowRight, Shield } from "lucide-react"

interface CustomerInfoProps {
  onNext: (data: any) => void
}

export function CustomerInfo({ onNext }: CustomerInfoProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    communicationPreference: "email",
    specialRequests: "",
    hasKeys: false,
    hasPets: false,
    petDetails: "",
    hasAllergies: false,
    allergyDetails: "",
    accessInstructions: "",
    emailUpdates: true,
    smsUpdates: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    onNext(formData)
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phone

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Customer Information
          </CardTitle>
          <CardDescription>We need some basic information to complete your booking</CardDescription>
        </CardHeader>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Your primary contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact (Optional)</CardTitle>
          <CardDescription>Someone we can contact if needed during service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                placeholder="Contact person name"
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
          <CardDescription>How would you like to receive updates about your service?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="communicationPreference">Preferred Communication Method</Label>
            <Select
              value={formData.communicationPreference}
              onValueChange={(value) => handleInputChange("communicationPreference", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="sms">Text Message</SelectItem>
                <SelectItem value="both">Email + Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailUpdates"
                checked={formData.emailUpdates}
                onCheckedChange={(checked) => handleInputChange("emailUpdates", checked as boolean)}
              />
              <Label htmlFor="emailUpdates" className="text-sm">
                Send me email updates about my booking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="smsUpdates"
                checked={formData.smsUpdates}
                onCheckedChange={(checked) => handleInputChange("smsUpdates", checked as boolean)}
              />
              <Label htmlFor="smsUpdates" className="text-sm">
                Send me SMS updates about my booking
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service-Specific Information */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Help us provide the best service possible</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasKeys"
                checked={formData.hasKeys}
                onCheckedChange={(checked) => handleInputChange("hasKeys", checked as boolean)}
              />
              <Label htmlFor="hasKeys" className="text-sm">
                I will provide keys/access for the cleaning team
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPets"
                checked={formData.hasPets}
                onCheckedChange={(checked) => handleInputChange("hasPets", checked as boolean)}
              />
              <Label htmlFor="hasPets" className="text-sm">
                I have pets in the home
              </Label>
            </div>

            {formData.hasPets && (
              <div>
                <Label htmlFor="petDetails">Pet Details</Label>
                <Textarea
                  id="petDetails"
                  value={formData.petDetails}
                  onChange={(e) => handleInputChange("petDetails", e.target.value)}
                  placeholder="Please describe your pets (type, temperament, any special considerations)"
                  rows={2}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAllergies"
                checked={formData.hasAllergies}
                onCheckedChange={(checked) => handleInputChange("hasAllergies", checked as boolean)}
              />
              <Label htmlFor="hasAllergies" className="text-sm">
                Someone in the household has allergies or sensitivities
              </Label>
            </div>

            {formData.hasAllergies && (
              <div>
                <Label htmlFor="allergyDetails">Allergy Details</Label>
                <Textarea
                  id="allergyDetails"
                  value={formData.allergyDetails}
                  onChange={(e) => handleInputChange("allergyDetails", e.target.value)}
                  placeholder="Please describe any allergies or product sensitivities"
                  rows={2}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="accessInstructions">Access Instructions</Label>
            <Textarea
              id="accessInstructions"
              value={formData.accessInstructions}
              onChange={(e) => handleInputChange("accessInstructions", e.target.value)}
              placeholder="Gate codes, parking instructions, key location, etc."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests or Notes</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              placeholder="Any specific areas to focus on or avoid, special instructions, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-blue-900 mb-1">Your Privacy is Protected</div>
              <div className="text-blue-700">
                We use your information only to provide cleaning services and communicate with you. We never share your
                personal information with third parties without your consent.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleContinue} disabled={!isFormValid} className="bg-blue-600 hover:bg-blue-700">
          Continue to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
