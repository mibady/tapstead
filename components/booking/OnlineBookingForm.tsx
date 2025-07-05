'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import type { BookingData, Service } from './BookingFlow'
import StripeCheckoutButton from '../stripe/StripeCheckoutButton'
import { calculatePrice } from '@/lib/booking/pricing'

interface OnlineBookingFormProps {
  step: number
  onNext: (data?: Partial<BookingData>) => void
  onBack: () => void
  serviceData: {
    frequency: FrequencyType
    bedrooms: BedroomType
  }
}

const FormStep = ({ title, children, onNext, onBack, showBackButton = true }: { title: string, children: React.ReactNode, onNext: () => void, onBack: () => void, showBackButton?: boolean }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
    <CardFooter className="flex justify-between">
      {showBackButton && <Button variant="outline" onClick={onBack}>Back</Button>}
      <Button onClick={onNext}>Next</Button>
    </CardFooter>
  </Card>
);

const PriceSummary = ({ bookingData }: { bookingData: BookingData }) => {
  const priceDetails = calculatePrice(bookingData);

  if (!priceDetails) {
    return <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">Enter details to see price.</div>;
  }

  return (
    <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
      <div className="space-y-1">
        <div className="flex justify-between"><span>Base Price:</span> <span>${priceDetails.base.toFixed(2)}</span></div>
        {priceDetails.addOns > 0 && <div className="flex justify-between"><span>Add-ons:</span> <span>${priceDetails.addOns.toFixed(2)}</span></div>}
        <div className="flex justify-between font-bold text-xl mt-2 border-t pt-2"><span>Total:</span> <span>${priceDetails.total.toFixed(2)}</span></div>
      </div>
    </div>
  );
};


export default function OnlineBookingForm({ step, onNext, onBack, serviceData }: OnlineBookingFormProps) {
  const [bookingData, setBookingData] = useState({
    bedrooms: serviceData.bedrooms,
    frequency: serviceData.frequency,
    addOns: [],
    date: undefined,
    time: '',
    contact: { name: '', email: '', phone: '' },
    address: { street: '', city: '', state: '', zip: '', apt: '' }
  });

  const updateBookingData = (data: Partial<typeof bookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };
  // Ensure we have default values for all fields to prevent undefined errors
  // Define default address with all required fields including optional apt
  const { 
    service, 
    bedrooms, 
    frequency, 
    addOns = [], 
    date, 
    time, 
    contact = { name: '', email: '', phone: '' }, 
    address = { street: '', city: '', state: '', zip: '', apt: '' }
  } = bookingData;
  
  // Ensure address has all required fields
  const safeAddress = address;
  
  // Show loading state if service is not yet loaded
  if (!service) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Service Information...</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleNext = (stepData: Partial<BookingData>) => {
    updateBookingData(stepData)
    onNext()
  }

  const handleAddOnToggle = (addOnId: string) => {
    const newAddOns = addOns?.includes(addOnId)
      ? addOns.filter(id => id !== addOnId)
      : [...(addOns || []), addOnId]
    updateBookingData({ addOns: newAddOns })
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBookingData({ contact: { ...contact, [e.target.name]: e.target.value } });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure we're only updating valid address fields
    if (name === 'street' || name === 'city' || name === 'state' || name === 'zip' || name === 'apt') {
      updateBookingData({ 
        address: { 
          ...address, 
          [name]: value 
        } 
      });
    }
  };



  switch (step) {
    case 1: // Customize
      return (
        <FormStep title="Customize Your Service" onNext={() => handleNext({})} onBack={onBack} showBackButton={false}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select value={bedrooms} onValueChange={(value) => updateBookingData({ bedrooms: value as '1-2' | '3-4' | '5+' })}>
                <SelectTrigger id="bedrooms"><SelectValue placeholder="Select bedrooms" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(b => <SelectItem key={b} value={b.toString()}>{b} Bedroom{b > 1 ? 's' : ''}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frequency</Label>
              <RadioGroup value={frequency} onValueChange={(value) => updateBookingData({ frequency: value as 'oneTime' | 'weekly' | 'biWeekly' | 'monthly' })}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="oneTime" id="oneTime" /><Label htmlFor="oneTime">One-Time</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="weekly" id="weekly" /><Label htmlFor="weekly">Weekly</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="biWeekly" id="biWeekly" /><Label htmlFor="biWeekly">Bi-Weekly</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="monthly" id="monthly" /><Label htmlFor="monthly">Monthly</Label></div>
              </RadioGroup>
            </div>
            {service?.addOns && Array.isArray(service.addOns) && service.addOns.length > 0 && (
              <div>
                <Label>Add-ons</Label>
                <div className="space-y-2 mt-2">
                  {Array.isArray(service.addOns) ? (
                    service.addOns.map((addOn) => (
                      <div key={addOn.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={addOn.id} 
                          checked={Array.isArray(addOns) && addOns.includes(addOn.id)}
                          onCheckedChange={() => handleAddOnToggle(addOn.id)}
                        />
                        <Label htmlFor={addOn.id}>
                          {addOn.name} {addOn.price ? `(+$${addOn.price.toFixed(2)})` : ''}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No add-ons available for this service.</p>
                  )}
                </div>
              </div>
            )}
            <PriceSummary bookingData={bookingData} />
          </div>
        </FormStep>
      );

    case 2: // Schedule
      return (
        <FormStep title="Schedule Your Appointment" onNext={() => handleNext({})} onBack={onBack}>
          <div className="flex flex-col md:flex-row gap-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => updateBookingData({ date: d })}
              className="rounded-md border"
            />
            <div className="flex-grow">
              <Label htmlFor="time">Available Times</Label>
              <Select value={time} onValueChange={(value) => updateBookingData({ time: value })}>
                <SelectTrigger id="time"><SelectValue placeholder="Select a time" /></SelectTrigger>
                <SelectContent>
                  {['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormStep>
      );

    case 3: // Contact & Address
      return (
        <FormStep title="Contact & Address" onNext={() => handleNext({})} onBack={onBack}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Full Name" value={contact?.name || ''} onChange={handleContactChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Email" value={contact?.email || ''} onChange={handleContactChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="Phone Number" value={contact?.phone || ''} onChange={handleContactChange} required />
            </div>
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input 
                id="street" 
                name="street" 
                placeholder="Street Address" 
                value={address?.street || ''} 
                onChange={handleAddressChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="apt">Apt/Suite (Optional)</Label>
              <Input 
                id="apt" 
                name="apt" 
                placeholder="Apt/Suite (Optional)" 
                value={safeAddress.apt || ''} 
                onChange={handleAddressChange} 
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="City" value={address?.city || ''} onChange={handleAddressChange} required />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" placeholder="State" value={address?.state || ''} onChange={handleAddressChange} required />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input id="zip" name="zip" placeholder="Zip Code" value={address?.zip || ''} onChange={handleAddressChange} required />
              </div>
            </div>
          </div>
        </FormStep>
      );

    case 4: // Payment
      return (
        <Card>
          <CardHeader><CardTitle>Confirm and Pay</CardTitle></CardHeader>
          <CardContent>
            <PriceSummary bookingData={bookingData} />
          </CardContent>
          <CardFooter className="flex justify-between">
             <Button variant="outline" onClick={onBack}>Back</Button>
            <StripeCheckoutButton
              price={calculatePrice(bookingData)?.total || 0}
              onSuccess={() => {
                console.log("Payment successful!");
                // Optionally redirect or show a success message
              }}
              onCancel={() => {
                console.log("Payment canceled.");
              }}
            />
          </CardFooter>
        </Card>
      );

    default:
      return null;
  }
}
