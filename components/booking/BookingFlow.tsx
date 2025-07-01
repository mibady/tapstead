"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { CalendarIcon, Clock, CheckIcon } from 'lucide-react'
import { StepIllustration } from './StepIllustration'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import StripeCheckoutButton from '../stripe/StripeCheckoutButton'
import {
  BedroomType,
  FrequencyType,
  AddOnType,
  calculatePrice,
  getAddOnProducts,
  getFrequencyLabel,
  getBedroomLabel,
  PRICING_DETAILS
} from '@/lib/booking/pricing'

interface BookingData {
  bedrooms: BedroomType;
  frequency: FrequencyType;
  addOns: AddOnType[];
  date: Date | undefined;
  time: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    apt?: string;
    city: string;
    state: string;
    zip: string;
  };
}

const AVAILABLE_TIMES = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'
];

const DEFAULT_BOOKING_DATA: BookingData = {
  bedrooms: '1-2',
  frequency: 'oneTime',
  addOns: [],
  date: undefined,
  time: '',
  contact: { name: '', email: '', phone: '' },
  address: { street: '', city: '', state: '', zip: '' }
};

interface BookingFlowProps {
  initialServiceId?: string;
}

export default function BookingFlow({ initialServiceId }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>(DEFAULT_BOOKING_DATA);

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const priceDetails = useMemo(() => {
    return calculatePrice({
      bedrooms: bookingData.bedrooms,
      frequency: bookingData.frequency,
      addOns: bookingData.addOns
    });
  }, [bookingData.bedrooms, bookingData.frequency, bookingData.addOns]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const { base, addOns, total } = priceDetails;

  const lineItems = useMemo(() => {
    const items = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `House Cleaning - ${getBedroomLabel(bookingData.bedrooms)}`,
          description: `${getFrequencyLabel(bookingData.frequency)} scheduled for ${bookingData.date ? format(bookingData.date, 'PPP') : ''} at ${bookingData.time}`
        },
        unit_amount: base * 100
      },
      quantity: 1
    }];

    if (addOns > 0) {
      const addOnProducts = getAddOnProducts(bookingData.addOns);
      addOnProducts.forEach(({ productId, price }) => {
        items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Add-on: ${productId}`,
            },
            unit_amount: price * 100
          },
          quantity: 1
        });
      });
    }

    return items;
  }, [bookingData, base, addOns]);

  const metadata = {
    frequency: bookingData.frequency,
    bedrooms: bookingData.bedrooms,
    addOns: bookingData.addOns.join(','),
    scheduledDate: bookingData.date?.toISOString(),
    scheduledTime: bookingData.time,
    customerName: bookingData.contact.name,
    customerEmail: bookingData.contact.email,
    customerPhone: bookingData.contact.phone,
    address: [
      bookingData.address.street,
      bookingData.address.apt,
      bookingData.address.city,
      bookingData.address.state,
      bookingData.address.zip
    ].filter(Boolean).join(', ')
  };

  const renderPricing = () => (
    <div className="rounded-lg bg-gray-50 p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Base Price:</span>
        <span>${base}</span>
      </div>
      {addOns > 0 && (
        <div className="flex justify-between text-sm">
          <span>Add-ons:</span>
          <span>${addOns}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold text-lg pt-2 border-t">
        <span>Total:</span>
        <span>${total}</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Select Home Size</Label>
        <RadioGroup
          value={bookingData.bedrooms}
          onValueChange={(value: BedroomType) => updateBookingData({ bedrooms: value })}
          className="grid gap-4 mt-2"
        >
          {Object.keys(PRICING_DETAILS.frequencies.oneTime).map((size) => (
            <div key={size} className="flex items-center">
              <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`size-${size}`}
                className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="space-y-1">
                  <p className="font-medium leading-none">{getBedroomLabel(size as BedroomType)}</p>
                  <p className="text-sm text-muted-foreground">From ${PRICING_DETAILS.frequencies.oneTime[size as BedroomType].price}/clean</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base">Select Frequency</Label>
        <RadioGroup
          value={bookingData.frequency}
          onValueChange={(value: FrequencyType) => updateBookingData({ frequency: value })}
          className="grid gap-4 mt-2"
        >
          {Object.keys(PRICING_DETAILS.frequencies).map((freq) => (
            <div key={freq} className="flex items-center">
              <RadioGroupItem value={freq} id={`freq-${freq}`} className="peer sr-only" />
              <Label
                htmlFor={`freq-${freq}`}
                className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="space-y-1">
                  <p className="font-medium leading-none">{getFrequencyLabel(freq as FrequencyType)}</p>
                  <p className="text-sm text-muted-foreground">
                    ${PRICING_DETAILS.frequencies[freq as FrequencyType][bookingData.bedrooms].price}/clean
                  </p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base">Add-ons (Optional)</Label>
        <div className="space-y-2 mt-2">
          {Object.entries(PRICING_DETAILS.addOns).map(([id, { price }]) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={bookingData.addOns.includes(id as AddOnType)}
                onCheckedChange={(checked) => {
                  const newAddOns = checked
                    ? [...bookingData.addOns, id as AddOnType]
                    : bookingData.addOns.filter(a => a !== id);
                  updateBookingData({ addOns: newAddOns });
                }}
              />
              <Label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {id === 'deepClean' ? 'Deep Clean' : 'Move In/Out Clean'} (+${price})
              </Label>
            </div>
          ))}
        </div>
      </div>

      {renderPricing()}

      <Button onClick={handleNext} className="w-full">Continue to Scheduling</Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label>Select Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !bookingData.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {bookingData.date ? format(bookingData.date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={bookingData.date}
              onSelect={(date) => updateBookingData({ date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label>Select Time</Label>
        <Select value={bookingData.time} onValueChange={(time) => updateBookingData({ time })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_TIMES.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
        <Button 
          onClick={handleNext} 
          className="flex-1"
          disabled={!bookingData.date || !bookingData.time}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={bookingData.contact.name}
            onChange={(e) => updateBookingData({
              contact: { ...bookingData.contact, name: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={bookingData.contact.email}
            onChange={(e) => updateBookingData({
              contact: { ...bookingData.contact, email: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={bookingData.contact.phone}
            onChange={(e) => updateBookingData({
              contact: { ...bookingData.contact, phone: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={bookingData.address.street}
            onChange={(e) => updateBookingData({
              address: { ...bookingData.address, street: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="apt">Apartment/Suite (Optional)</Label>
          <Input
            id="apt"
            value={bookingData.address.apt}
            onChange={(e) => updateBookingData({
              address: { ...bookingData.address, apt: e.target.value }
            })}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={bookingData.address.city}
              onChange={(e) => updateBookingData({
                address: { ...bookingData.address, city: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={bookingData.address.state}
              onChange={(e) => updateBookingData({
                address: { ...bookingData.address, state: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={bookingData.address.zip}
              onChange={(e) => updateBookingData({
                address: { ...bookingData.address, zip: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
        <Button 
          onClick={handleNext}
          className="flex-1"
          disabled={!bookingData.contact.name || !bookingData.contact.email || !bookingData.contact.phone ||
                   !bookingData.address.street || !bookingData.address.city || !bookingData.address.state || !bookingData.address.zip}
        >
          Review & Pay
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Service Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Home Size:</div>
            <div>{getBedroomLabel(bookingData.bedrooms)}</div>
            <div className="text-muted-foreground">Frequency:</div>
            <div>{getFrequencyLabel(bookingData.frequency)}</div>
            <div className="text-muted-foreground">Date & Time:</div>
            <div>{format(bookingData.date!, "PPP")} at {bookingData.time}</div>
            {bookingData.addOns.length > 0 && (
              <>
                <div className="text-muted-foreground">Add-ons:</div>
                <div>{bookingData.addOns.map(a => a === 'deepClean' ? 'Deep Clean' : 'Move In/Out Clean').join(', ')}</div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Contact Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Name:</div>
            <div>{bookingData.contact.name}</div>
            <div className="text-muted-foreground">Email:</div>
            <div>{bookingData.contact.email}</div>
            <div className="text-muted-foreground">Phone:</div>
            <div>{bookingData.contact.phone}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Service Address</h3>
          <div className="text-sm">
            {bookingData.address.street}
            {bookingData.address.apt && `, ${bookingData.address.apt}`}<br />
            {bookingData.address.city}, {bookingData.address.state} {bookingData.address.zip}
          </div>
        </div>

        {renderPricing()}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
        <StripeCheckoutButton
          lineItems={lineItems}
          metadata={metadata}
          onSuccess={() => setStep(5)}
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center space-y-4">
      <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto">
        <CheckIcon className="w-6 h-6 text-green-600" />
      </div>
      <h2 className="text-2xl font-semibold text-green-600">Booking Confirmed!</h2>
      <p className="text-muted-foreground">
        Thank you for booking with us. A confirmation email has been sent to {bookingData.contact.email}.
      </p>
      <Button onClick={() => {
        setStep(1);
        setBookingData(DEFAULT_BOOKING_DATA);
      }}>
        Book Another Service
      </Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-start gap-12">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Book Your Home Cleaning</CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
              {step === 5 && renderStep5()}
            </CardContent>
          </Card>
        </div>
        {step < 5 && <StepIllustration step={step} />}
      </div>
    </div>
  );
}