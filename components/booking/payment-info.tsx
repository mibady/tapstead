"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Shield, Lock, DollarSign, Check } from "lucide-react"

interface PaymentInfoProps {
  onNext: (data: any) => void
  onBack: () => void
  bookingData: any
}

export function PaymentInfo({ onNext, onBack, bookingData }: PaymentInfoProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingZip: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate final pricing
  const basePrice = bookingData.details?.estimatedPrice || 0
  const discountPercent = bookingData.customer?.appliedDiscount || 0
  const discountAmount = Math.round(basePrice * (discountPercent / 100))
  const subtotal = basePrice - discountAmount
  const tax = Math.round(subtotal * 0.08) // 8% tax
  const total = subtotal + tax

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onNext({
      ...paymentData,
      paymentConfirmed: true,
      finalTotal: total,
      bookingId: `TS-${Date.now()}`,
    })
  }

  const isFormValid =
    paymentData.cardNumber &&
    paymentData.expiryDate &&
    paymentData.cvv &&
    paymentData.nameOnCard &&
    paymentData.billingZip

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Secure Payment
          </CardTitle>
          <CardDescription>Your payment information is encrypted and secure</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lock className="w-4 h-4 mr-2" />
                Payment Information
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL encryption</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  placeholder="John Smith"
                  value={paymentData.nameOnCard}
                  onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="billingZip">Billing ZIP Code</Label>
                <Input
                  id="billingZip"
                  placeholder="12345"
                  value={paymentData.billingZip}
                  onChange={(e) => handleInputChange("billingZip", e.target.value)}
                  maxLength={5}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="w-4 h-4 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Details */}
              <div className="space-y-2">
                <div className="font-medium">{bookingData.service?.title}</div>
                <div className="text-sm text-gray-600">
                  {bookingData.details?.date} at {bookingData.details?.time}
                </div>
                <div className="text-sm text-gray-600">{bookingData.details?.address}</div>
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span>${basePrice}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>${tax}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-green-600">${total}</span>
              </div>

              {/* Guarantees */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="w-3 h-3 mr-2 text-green-500" />
                  <span>100% satisfaction guarantee</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 mr-2 text-green-500" />
                  <span>Fully insured professionals</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 mr-2 text-green-500" />
                  <span>No hidden fees</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isProcessing}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              Complete Booking - ${total}
              <Lock className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
