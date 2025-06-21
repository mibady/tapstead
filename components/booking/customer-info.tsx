"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, User, Shield, Percent } from "lucide-react"

interface CustomerInfoProps {
  onNext: (data: any) => void
  onBack: () => void
}

export function CustomerInfo({ onNext, onBack }: CustomerInfoProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    customerType: "",
    militaryStatus: false,
    isNewCustomer: true,
    marketingOptIn: false,
  })

  const [discount, setDiscount] = useState(0)

  const customerTypes = [
    { value: "homeowner", label: "Homeowner" },
    { value: "renter", label: "Renter" },
    { value: "property-manager", label: "Property Manager" },
    { value: "real-estate", label: "Real Estate Professional" },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Calculate discounts
    let newDiscount = 0
    if (field === "militaryStatus" && value === true) {
      newDiscount += 10 // 10% military discount
    } else if (formData.militaryStatus && field !== "militaryStatus") {
      newDiscount += 10
    }

    if (formData.isNewCustomer) {
      newDiscount += 20 // 20% new customer discount
    }

    setDiscount(newDiscount)
  }

  const handleContinue = () => {
    onNext({ ...formData, appliedDiscount: discount })
  }

  const isFormValid =
    formData.firstName && formData.lastName && formData.email && formData.phone && formData.customerType

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Your Information
          </CardTitle>
          <CardDescription>We need your contact information to coordinate the service</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Type & Discounts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerType">I am a...</Label>
                <Select
                  value={formData.customerType}
                  onValueChange={(value) => handleInputChange("customerType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="military"
                    checked={formData.militaryStatus}
                    onCheckedChange={(checked) => handleInputChange("militaryStatus", checked as boolean)}
                  />
                  <Label htmlFor="military" className="flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-blue-600" />I am military/veteran (10% discount)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={formData.marketingOptIn}
                    onCheckedChange={(checked) => handleInputChange("marketingOptIn", checked as boolean)}
                  />
                  <Label htmlFor="marketing" className="text-sm">
                    Send me tips, promotions, and updates (optional)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discounts & Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Percent className="w-4 h-4 mr-2" />
                Available Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.isNewCustomer && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">New Customer</div>
                      <div className="text-sm text-green-600">Welcome discount</div>
                    </div>
                    <Badge className="bg-green-600">20% OFF</Badge>
                  </div>
                </div>
              )}

              {formData.militaryStatus && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-800">Military/Veteran</div>
                      <div className="text-sm text-blue-600">Thank you for your service</div>
                    </div>
                    <Badge className="bg-blue-600">10% OFF</Badge>
                  </div>
                </div>
              )}

              {discount > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Discount</span>
                    <span className="text-green-600">{discount}% OFF</span>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                <Shield className="w-3 h-3 inline mr-1" />
                Your information is secure and encrypted
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
          Continue to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
