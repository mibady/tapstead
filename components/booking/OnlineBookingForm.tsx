import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Clock, MapPin, User, CreditCard, ArrowLeft } from 'lucide-react'
import StripeCheckoutButton from './StripeCheckoutButton'

interface BookingFormData {
  // Step 2: Service Details
  homeSize: string;
  rooms: number;
  bathrooms: number;
  serviceType: 'standard' | 'deep' | 'move-in' | 'move-out';
  frequency: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly';
  
  // Step 3: Date & Time
  preferredDate: string;
  preferredTime: string;
  flexibleScheduling: boolean;
  
  // Step 4: Address & Access
  address: string;
  city: string;
  state: string;
  zipCode: string;
  apartmentUnit?: string;
  accessNotes?: string;
  
  // Step 5: Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Step 6: Special Instructions
  specialInstructions?: string;
  supplies: 'bring-own' | 'client-provides';
  pets: boolean;
  petDetails?: string;
}

const stepTitles = [
  '',
  'Service Details',
  'Date & Time', 
  'Address & Access',
  'Contact Information',
  'Special Instructions',
  'Payment'
];

export default function OnlineBookingForm({ 
  step, 
  onNext, 
  onBack 
}: { 
  step: number, 
  onNext: (data?: any) => void, 
  onBack: () => void 
}) {
  const [formData, setFormData] = useState<BookingFormData>({
    homeSize: '',
    rooms: 1,
    bathrooms: 1,
    serviceType: 'standard',
    frequency: 'one-time',
    preferredDate: '',
    preferredTime: '',
    flexibleScheduling: false,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    supplies: 'bring-own',
    pets: false
  });

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const calculatePrice = () => {
    let basePrice = 99; // Starting price
    
    // Size adjustments
    if (formData.homeSize === '3-4-bedroom') basePrice = 149;
    else if (formData.homeSize === '5+-bedroom') basePrice = 199;
    
    // Service type adjustments
    if (formData.serviceType === 'deep') basePrice *= 1.5;
    else if (formData.serviceType === 'move-in' || formData.serviceType === 'move-out') basePrice *= 1.8;
    
    // Room/bathroom adjustments
    basePrice += (formData.rooms - 1) * 15;
    basePrice += (formData.bathrooms - 1) * 20;
    
    return Math.round(basePrice);
  };

  const handleNext = () => {
    onNext(formData);
  };

  if (step === 2) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {stepTitles[step]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Home Size</Label>
            <Select value={formData.homeSize} onValueChange={(value) => updateFormData({ homeSize: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select your home size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2-bedroom">1-2 Bedroom ($99-129)</SelectItem>
                <SelectItem value="3-4-bedroom">3-4 Bedroom ($149-199)</SelectItem>
                <SelectItem value="5+-bedroom">5+ Bedroom ($199-299)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Number of Rooms</Label>
              <Input 
                type="number" 
                min="1" 
                max="10"
                value={formData.rooms}
                onChange={(e) => updateFormData({ rooms: parseInt(e.target.value) || 1 })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Number of Bathrooms</Label>
              <Input 
                type="number" 
                min="1" 
                max="6"
                value={formData.bathrooms}
                onChange={(e) => updateFormData({ bathrooms: parseInt(e.target.value) || 1 })}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Service Type</Label>
            <Select value={formData.serviceType} onValueChange={(value: any) => updateFormData({ serviceType: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Cleaning</SelectItem>
                <SelectItem value="deep">Deep Cleaning (+50%)</SelectItem>
                <SelectItem value="move-in">Move-in Cleaning (+80%)</SelectItem>
                <SelectItem value="move-out">Move-out Cleaning (+80%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value: any) => updateFormData({ frequency: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time Service</SelectItem>
                <SelectItem value="weekly">Weekly (Save 15%)</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly (Save 10%)</SelectItem>
                <SelectItem value="monthly">Monthly (Save 5%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-green-800">
              Estimated Price: ${calculatePrice()}
            </div>
            <div className="text-sm text-green-600">Final price confirmed during booking</div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!formData.homeSize} className="flex-1">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 3) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {stepTitles[step]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preferred Date</Label>
              <Input 
                type="date" 
                value={formData.preferredDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => updateFormData({ preferredDate: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Preferred Time</Label>
              <Select value={formData.preferredTime} onValueChange={(value) => updateFormData({ preferredTime: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM-8PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="flexible"
              checked={formData.flexibleScheduling}
              onCheckedChange={(checked) => updateFormData({ flexibleScheduling: checked as boolean })}
            />
            <Label htmlFor="flexible" className="text-sm">
              I'm flexible with scheduling (may get discounted rates)
            </Label>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!formData.preferredDate || !formData.preferredTime} 
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 4) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {stepTitles[step]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Street Address</Label>
            <Input 
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="123 Main Street"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Apartment/Unit (Optional)</Label>
            <Input 
              value={formData.apartmentUnit || ''}
              onChange={(e) => updateFormData({ apartmentUnit: e.target.value })}
              placeholder="Unit 2B"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>City</Label>
              <Input 
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>State</Label>
              <Input 
                value={formData.state}
                onChange={(e) => updateFormData({ state: e.target.value })}
                placeholder="CA"
                className="mt-2"
              />
            </div>
            <div>
              <Label>ZIP Code</Label>
              <Input 
                value={formData.zipCode}
                onChange={(e) => updateFormData({ zipCode: e.target.value })}
                placeholder="90210"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label>Access Notes (Optional)</Label>
            <Textarea 
              value={formData.accessNotes || ''}
              onChange={(e) => updateFormData({ accessNotes: e.target.value })}
              placeholder="Gate code, parking instructions, key location, etc."
              className="mt-2"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!formData.address || !formData.city || !formData.state || !formData.zipCode} 
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 5) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {stepTitles[step]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input 
                value={formData.firstName}
                onChange={(e) => updateFormData({ firstName: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input 
                value={formData.lastName}
                onChange={(e) => updateFormData({ lastName: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label>Email Address</Label>
            <Input 
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input 
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="(360) 641-7386"
              className="mt-2"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone} 
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 6) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{stepTitles[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Cleaning Supplies</Label>
            <Select value={formData.supplies} onValueChange={(value: any) => updateFormData({ supplies: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bring-own">We'll bring eco-friendly supplies (Recommended)</SelectItem>
                <SelectItem value="client-provides">I'll provide my own supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pets"
                checked={formData.pets}
                onCheckedChange={(checked) => updateFormData({ pets: checked as boolean })}
              />
              <Label htmlFor="pets">I have pets at home</Label>
            </div>
            
            {formData.pets && (
              <Textarea 
                value={formData.petDetails || ''}
                onChange={(e) => updateFormData({ petDetails: e.target.value })}
                placeholder="Tell us about your pets (type, temperament, any special considerations)"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label>Special Instructions (Optional)</Label>
            <Textarea 
              value={formData.specialInstructions || ''}
              onChange={(e) => updateFormData({ specialInstructions: e.target.value })}
              placeholder="Areas to focus on, items to avoid, allergies, or other specific requests"
              className="mt-2"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} className="flex-1">
              Review & Pay
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 7) {
    const finalPrice = calculatePrice();
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Home Cleaning - ${formData.serviceType}`,
          description: `${formData.homeSize} home, ${formData.rooms} rooms, ${formData.bathrooms} bathrooms`
        },
        unit_amount: finalPrice * 100, // Stripe expects cents
      },
      quantity: 1,
    }];

    const metadata = {
      service_type: 'home-cleaning',
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      service_date: formData.preferredDate,
      service_time: formData.preferredTime,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      home_size: formData.homeSize,
      rooms: formData.rooms.toString(),
      bathrooms: formData.bathrooms.toString(),
      cleaning_type: formData.serviceType,
      frequency: formData.frequency,
      supplies: formData.supplies,
      pets: formData.pets.toString(),
      special_instructions: formData.specialInstructions || '',
      flexible_scheduling: formData.flexibleScheduling.toString()
    };

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Review & Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Service:</div>
              <div>{formData.serviceType} cleaning</div>
              <div className="font-medium">Home Size:</div>
              <div>{formData.homeSize}</div>
              <div className="font-medium">Date & Time:</div>
              <div>{formData.preferredDate} - {formData.preferredTime}</div>
              <div className="font-medium">Address:</div>
              <div>{formData.address}, {formData.city}, {formData.state}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-green-600">${finalPrice}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Includes all supplies, labor, and satisfaction guarantee
            </div>
          </div>

          <StripeCheckoutButton
            lineItems={lineItems}
            metadata={metadata}
            onSuccess={() => onNext(formData)}
          />

          <Button variant="outline" onClick={onBack} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit Details
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
