"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Home, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BookingDetailsProps {
  service: any
  onNext: (data: any) => void
}

const houseSizes = [
  { id: "small", name: "Small (1-2 bedrooms)", price: 149, description: "Apartments, condos, small homes" },
  { id: "medium", name: "Medium (3-4 bedrooms)", price: 199, description: "Most single-family homes" },
  { id: "large", name: "Large (5+ bedrooms)", price: 299, description: "Large homes, multi-level properties" },
]

const frequencies = [
  { id: "one-time", name: "One-time", discount: 0, description: "Perfect for deep cleaning or special occasions" },
  { id: "weekly", name: "Weekly", discount: 33, description: "Save 33% - Best for busy families" },
  { id: "biweekly", name: "Bi-weekly", discount: 27, description: "Save 27% - Most popular choice" },
  { id: "monthly", name: "Monthly", discount: 20, description: "Save 20% - Great for maintenance" },
]

const addOns = [
  { id: "deep-clean", name: "Deep Cleaning", price: 50, description: "Inside appliances, baseboards, detailed work" },
  { id: "move-inout", name: "Move In/Out", price: 75, description: "Extra thorough cleaning for moving" },
  { id: "inside-appliances", name: "Inside Appliances", price: 30, description: "Oven, refrigerator, microwave" },
  { id: "garage", name: "Garage Cleaning", price: 40, description: "Sweep, organize, basic cleaning" },
]

const timeSlots = [
  "8:00 AM - 11:00 AM",
  "9:00 AM - 12:00 PM",
  "10:00 AM - 1:00 PM",
  "11:00 AM - 2:00 PM",
  "12:00 PM - 3:00 PM",
  "1:00 PM - 4:00 PM",
  "2:00 PM - 5:00 PM",
]

export function BookingDetails({ service, onNext }: BookingDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedFrequency, setSelectedFrequency] = useState<string>("one-time")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [address, setAddress] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")

  const calculatePrice = () => {
    if (!selectedSize) return 0

    const baseSize = houseSizes.find((size) => size.id === selectedSize)
    if (!baseSize) return 0

    const frequency = frequencies.find((freq) => freq.id === selectedFrequency)
    const discount = frequency?.discount || 0

    const basePrice = baseSize.price
    const addOnPrice = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    const subtotal = basePrice + addOnPrice
    const discountAmount = (subtotal * discount) / 100
    const finalPrice = subtotal - discountAmount

    return {
      basePrice,
      addOnPrice,
      subtotal,
      discount,
      discountAmount,
      finalPrice,
    }
  }

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]))
  }

  const handleContinue = () => {
    const pricing = calculatePrice()
    const selectedSizeData = houseSizes.find((size) => size.id === selectedSize)
    const selectedFrequencyData = frequencies.find((freq) => freq.id === selectedFrequency)
    const selectedAddOnData = selectedAddOns.map((id) => addOns.find((addOn) => addOn.id === id))

    onNext({
      service,
      houseSize: selectedSizeData,
      frequency: selectedFrequencyData,
      addOns: selectedAddOnData,
      date: selectedDate,
      time: selectedTime,
      address,
      specialInstructions,
      pricing,
    })
  }

  const pricing = calculatePrice()
  const isFormValid = selectedSize && selectedDate && selectedTime && address.trim()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="w-5 h-5 mr-2" />
            House Cleaning Details
          </CardTitle>
          <CardDescription>Configure your cleaning service with fixed, transparent pricing</CardDescription>
        </CardHeader>
      </Card>

      {/* House Size Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Home Size</CardTitle>
          <CardDescription>Choose the size that best matches your home</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {houseSizes.map((size) => (
              <div
                key={size.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedSize === size.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedSize(size.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-gray-600">{size.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">${size.price}</div>
                    <div className="text-xs text-gray-500">base price</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frequency Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Frequency</CardTitle>
          <CardDescription>Save money with recurring service subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {frequencies.map((frequency) => (
              <div
                key={frequency.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedFrequency === frequency.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedFrequency(frequency.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{frequency.name}</span>
                      {frequency.discount > 0 && (
                        <Badge className="ml-2 bg-green-500 hover:bg-green-600">Save {frequency.discount}%</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{frequency.description}</div>
                  </div>
                  {frequency.discount > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-green-600 font-medium">-{frequency.discount}% off</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      <Card>
        <CardHeader>
          <CardTitle>Add-on Services</CardTitle>
          <CardDescription>Enhance your cleaning with additional services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {addOns.map((addOn) => (
              <div key={addOn.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={addOn.id}
                  checked={selectedAddOns.includes(addOn.id)}
                  onCheckedChange={() => handleAddOnToggle(addOn.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={addOn.id} className="font-medium cursor-pointer">
                    {addOn.name}
                  </Label>
                  <div className="text-sm text-gray-600">{addOn.description}</div>
                </div>
                <div className="font-semibold text-green-600">+${addOn.price}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date and Time */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose your preferred cleaning date</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
            <CardDescription>Choose your preferred time slot</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {slot}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Service Address</CardTitle>
          <CardDescription>Where should we provide the cleaning service?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your complete address including apartment/unit number"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Any special instructions, access codes, or areas of focus"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      {selectedSize && (
        <Card>
          <CardHeader>
            <CardTitle>Price Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Base Price ({houseSizes.find((s) => s.id === selectedSize)?.name})</span>
                <span>${pricing.basePrice}</span>
              </div>
              {pricing.addOnPrice > 0 && (
                <div className="flex justify-between">
                  <span>Add-ons</span>
                  <span>+${pricing.addOnPrice}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${pricing.subtotal}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    {frequencies.find((f) => f.id === selectedFrequency)?.name} Discount ({pricing.discount}%)
                  </span>
                  <span>-${pricing.discountAmount}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">${pricing.finalPrice}</span>
                </div>
                {selectedFrequency !== "one-time" && (
                  <div className="text-sm text-gray-600 mt-1">Recurring {selectedFrequency} • Cancel anytime</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleContinue} disabled={!isFormValid} className="bg-blue-600 hover:bg-blue-700">
          Continue to Customer Info
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
