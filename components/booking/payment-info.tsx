"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Shield, Calendar } from "lucide-react"
import { StripePaymentForm } from "./stripe-payment-form"

interface PaymentInfoProps {
  bookingData: any
  onNext: (data: any) => void
}

export function PaymentInfo({ bookingData, onNext }: PaymentInfoProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    sameAsService: true,
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleBillingChange = (field: string, value: string | boolean) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentSuccess = (paymentData: any) => {
    onNext({
      paymentMethod,
      billingAddress,
      paymentData,
      agreeToTerms,
    })
  }

  const isRecurring = bookingData.frequency?.id !== "one-time"
  const pricing = bookingData.pricing

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Information
          </CardTitle>
          <CardDescription>Secure payment processing powered by Stripe</CardDescription>
        </CardHeader>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Service</span>
              <span>{bookingData.service?.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Home Size</span>
              <span>{bookingData.houseSize?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Frequency</span>
              <span>{bookingData.frequency?.name}</span>
            </div>
            {bookingData.addOns?.length > 0 && (
              <div className="flex justify-between">
                <span>Add-ons</span>
                <span>{bookingData.addOns.map((addon: any) => addon.name).join(", ")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Date & Time</span>
              <span>
                {bookingData.date?.toLocaleDateString()} at {bookingData.time}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${pricing?.subtotal}</span>
              </div>
              {pricing?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({pricing.discount}%)</span>
                  <span>-${pricing.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-green-600">${pricing?.finalPrice}</span>
              </div>
              {isRecurring && (
                <div className="text-sm text-gray-600 mt-1">
                  Recurring {bookingData.frequency?.name.toLowerCase()} • Cancel anytime
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>Address for billing purposes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsService"
              checked={billingAddress.sameAsService}
              onCheckedChange={(checked) => handleBillingChange("sameAsService", checked as boolean)}
            />
            <Label htmlFor="sameAsService" className="text-sm">
              Same as service address
            </Label>
          </div>

          {!billingAddress.sameAsService && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingFirstName">First Name</Label>
                  <Input
                    id="billingFirstName"
                    value={billingAddress.firstName}
                    onChange={(e) => handleBillingChange("firstName", e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="billingLastName">Last Name</Label>
                  <Input
                    id="billingLastName"
                    value={billingAddress.lastName}
                    onChange={(e) => handleBillingChange("lastName", e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="billingAddress">Address</Label>
                <Input
                  id="billingAddress"
                  value={billingAddress.address}
                  onChange={(e) => handleBillingChange("address", e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">City</Label>
                  <Input
                    id="billingCity"
                    value={billingAddress.city}
                    onChange={(e) => handleBillingChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="billingState">State</Label>
                  <Select value={billingAddress.state} onValueChange={(value) => handleBillingChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="billingZipCode">ZIP Code</Label>
                  <Input
                    id="billingZipCode"
                    value={billingAddress.zipCode}
                    onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                    placeholder="ZIP code"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <StripePaymentForm
            bookingData={bookingData}
            billingAddress={billingAddress}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-green-900 mb-1">Secure Payment Processing</div>
                <div className="text-green-700">
                  Your payment information is encrypted and processed securely by Stripe. We never store your card
                  details on our servers.
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              />
              <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                . I understand that{" "}
                {isRecurring ? "my subscription will automatically renew" : "payment will be processed"} and I can{" "}
                {isRecurring ? "cancel anytime" : "request a refund within 24 hours"}.
              </Label>
            </div>

            {isRecurring && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 mb-1">Subscription Details</div>
                    <div className="text-blue-700">
                      Your {bookingData.frequency?.name.toLowerCase()} subscription will automatically renew for $
                      {pricing?.finalPrice} every{" "}
                      {bookingData.frequency?.id === "weekly"
                        ? "week"
                        : bookingData.frequency?.id === "biweekly"
                          ? "2 weeks"
                          : "month"}
                      . You can cancel or modify your subscription anytime from your account dashboard.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
