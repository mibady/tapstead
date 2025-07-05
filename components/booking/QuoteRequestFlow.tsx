'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, CheckIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface QuoteRequestData {
  serviceType: string;
  propertyDetails: {
    type: string;
    size: string;
    details: string;
  };
  preferredDate: Date | undefined;
  preferredTime: string;
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
  additionalNotes: string;
}

const DEFAULT_QUOTE_DATA: QuoteRequestData = {
  serviceType: '',
  propertyDetails: {
    type: '',
    size: '',
    details: ''
  },
  preferredDate: undefined,
  preferredTime: '',
  contact: { name: '', email: '', phone: '' },
  address: { street: '', city: '', state: '', zip: '' },
  additionalNotes: ''
};

const AVAILABLE_TIMES = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'
];

const SERVICES = [
  'Window Cleaning',
  'Pressure Washing',
  'Gutter Cleaning',
  'Solar Panel Cleaning',
  'Christmas Light Installation',
  'Roof Cleaning'
];

export default function QuoteRequestFlow() {
  const [step, setStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteRequestData>(DEFAULT_QUOTE_DATA);

  const updateQuoteData = (updates: Partial<QuoteRequestData>) => {
    setQuoteData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Select Service</Label>
        <Select value={quoteData.serviceType} onValueChange={(value) => updateQuoteData({ serviceType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent>
            {SERVICES.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="propertyType">Property Type</Label>
        <Select value={quoteData.propertyDetails.type} 
                onValueChange={(value) => updateQuoteData({ 
                  propertyDetails: { ...quoteData.propertyDetails, type: value }
                })}>
          <SelectTrigger id="propertyType">
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="multi-family">Multi-Family</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="propertySize">Property Size</Label>
        <Input
          id="propertySize"
          placeholder="e.g., 2000 sq ft"
          value={quoteData.propertyDetails.size}
          onChange={(e) => updateQuoteData({
            propertyDetails: { ...quoteData.propertyDetails, size: e.target.value }
          })}
        />
      </div>

      <div>
        <Label htmlFor="propertyDetails">Property Details</Label>
        <Textarea
          id="propertyDetails"
          placeholder="Please provide any relevant details about your property"
          value={quoteData.propertyDetails.details}
          onChange={(e) => updateQuoteData({
            propertyDetails: { ...quoteData.propertyDetails, details: e.target.value }
          })}
        />
      </div>

      <Button 
        onClick={handleNext} 
        className="w-full"
        disabled={!quoteData.serviceType || !quoteData.propertyDetails.type}
      >
        Continue
      </Button>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label>Preferred Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !quoteData.preferredDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {quoteData.preferredDate ? format(quoteData.preferredDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={quoteData.preferredDate}
              onSelect={(date) => updateQuoteData({ preferredDate: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Preferred Time</Label>
        <Select value={quoteData.preferredTime} onValueChange={(time) => updateQuoteData({ preferredTime: time })}>
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
          disabled={!quoteData.preferredDate || !quoteData.preferredTime}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={quoteData.contact.name}
            onChange={(e) => updateQuoteData({
              contact: { ...quoteData.contact, name: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={quoteData.contact.email}
            onChange={(e) => updateQuoteData({
              contact: { ...quoteData.contact, email: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={quoteData.contact.phone}
            onChange={(e) => updateQuoteData({
              contact: { ...quoteData.contact, phone: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={quoteData.address.street}
            onChange={(e) => updateQuoteData({
              address: { ...quoteData.address, street: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="apt">Apartment/Suite (Optional)</Label>
          <Input
            id="apt"
            value={quoteData.address.apt}
            onChange={(e) => updateQuoteData({
              address: { ...quoteData.address, apt: e.target.value }
            })}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={quoteData.address.city}
              onChange={(e) => updateQuoteData({
                address: { ...quoteData.address, city: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={quoteData.address.state}
              onChange={(e) => updateQuoteData({
                address: { ...quoteData.address, state: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={quoteData.address.zip}
              onChange={(e) => updateQuoteData({
                address: { ...quoteData.address, zip: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information that might help us provide an accurate quote"
          value={quoteData.additionalNotes}
          onChange={(e) => updateQuoteData({ additionalNotes: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
        <Button 
          onClick={handleNext}
          className="flex-1"
          disabled={!quoteData.contact.name || !quoteData.contact.email || !quoteData.contact.phone ||
                   !quoteData.address.street || !quoteData.address.city || !quoteData.address.state || !quoteData.address.zip}
        >
          Submit Quote Request
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-4">
      <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto">
        <CheckIcon className="w-6 h-6 text-green-600" />
      </div>
      <h2 className="text-2xl font-semibold text-green-600">Quote Request Submitted!</h2>
      <p className="text-muted-foreground">
        Thank you for your request. We'll review your details and get back to you within 24 hours at {quoteData.contact.email}.
      </p>
      <Button onClick={() => {
        setStep(1);
        setQuoteData(DEFAULT_QUOTE_DATA);
      }}>
        Submit Another Request
      </Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>Request a Quote</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && renderServiceSelection()}
          {step === 2 && renderScheduling()}
          {step === 3 && renderContactInfo()}
          {step === 4 && renderConfirmation()}
        </CardContent>
      </Card>
    </div>
  );
}