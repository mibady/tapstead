import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, MessageSquare, ArrowLeft, Phone, Mail, CheckCircle } from 'lucide-react'
import { Service } from '@/lib/booking/services'

interface QuoteFormData {
  // Project Details
  projectDescription: string;
  urgency: 'no-rush' | 'within-week' | 'within-month' | 'emergency';
  budget: string;
  propertyType: 'single-family' | 'apartment' | 'condo' | 'commercial';
  
  // Contact Info  
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Preferences
  preferredContactMethod: 'phone' | 'email' | 'text';
  preferredTime: string;
  availableWeekdays: boolean;
  availableWeekends: boolean;
  specialRequests?: string;
}

const stepTitles = [
  '',
  'Project Details',
  'Contact Information', 
  'Quote Request Submitted'
];

export default function QuoteRequestForm({ 
  step, 
  onNext, 
  onBack, 
  service 
}: { 
  step: number; 
  onNext: (data?: any) => void; 
  onBack: () => void; 
  service: Service | null 
}) {
  const [formData, setFormData] = useState<QuoteFormData>({
    projectDescription: '',
    urgency: 'no-rush',
    budget: '',
    propertyType: 'single-family',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    preferredContactMethod: 'phone',
    preferredTime: '',
    availableWeekdays: true,
    availableWeekends: false
  });

  const updateFormData = (updates: Partial<QuoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmitQuote = async () => {
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceId: service?.id,
          serviceName: service?.name,
          submittedAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        onNext(formData);
      } else {
        // Handle error
        console.error('Failed to submit quote request');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
    }
  };

  if (step === 2) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle>{stepTitles[step]}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-600 text-blue-600">
              {service?.name}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">Free On-site Assessment</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Describe Your Project</Label>
            <Textarea 
              value={formData.projectDescription}
              onChange={(e) => updateFormData({ projectDescription: e.target.value })}
              placeholder="Please describe what you need done, including any specific requirements, problem areas, or goals for this project. The more details you provide, the better we can prepare for your free assessment."
              className="mt-2 min-h-[100px]"
            />
            <div className="text-xs text-gray-500 mt-1">
              Examples: "Leaky kitchen faucet needs repair", "Paint 3 bedrooms and hallway", "Clean gutters and check for damage"
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Property Type</Label>
            <Select value={formData.propertyType} onValueChange={(value: any) => updateFormData({ propertyType: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-family">Single Family Home</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condominium</SelectItem>
                <SelectItem value="commercial">Commercial Property</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">Timeline</Label>
            <Select value={formData.urgency} onValueChange={(value: any) => updateFormData({ urgency: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-rush">No rush - planning ahead</SelectItem>
                <SelectItem value="within-month">Within the next month</SelectItem>
                <SelectItem value="within-week">Within the next week</SelectItem>
                <SelectItem value="emergency">Emergency - ASAP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">Budget Range (Optional)</Label>
            <Select value={formData.budget} onValueChange={(value) => updateFormData({ budget: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select budget range if known" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-500">Under $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                <SelectItem value="5000-plus">$5,000+</SelectItem>
                <SelectItem value="not-sure">Not sure</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500 mt-1">
              This helps us prepare the right solutions for your needs
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={() => onNext(formData)} 
              disabled={!formData.projectDescription.trim()} 
              className="flex-1"
            >
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

          <div>
            <Label>Property Address</Label>
            <Input 
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="123 Main Street"
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
            <Label className="text-base font-medium">Preferred Contact Method</Label>
            <Select value={formData.preferredContactMethod} onValueChange={(value: any) => updateFormData({ preferredContactMethod: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="text">Text Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">Best Time to Contact</Label>
            <Select value={formData.preferredTime} onValueChange={(value) => updateFormData({ preferredTime: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                <SelectItem value="evening">Evening (5PM-8PM)</SelectItem>
                <SelectItem value="anytime">Anytime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Available Days</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="weekdays"
                  checked={formData.availableWeekdays}
                  onCheckedChange={(checked) => updateFormData({ availableWeekdays: checked as boolean })}
                />
                <Label htmlFor="weekdays">Weekdays</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="weekends"
                  checked={formData.availableWeekends}
                  onCheckedChange={(checked) => updateFormData({ availableWeekends: checked as boolean })}
                />
                <Label htmlFor="weekends">Weekends</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Special Requests or Notes (Optional)</Label>
            <Textarea 
              value={formData.specialRequests || ''}
              onChange={(e) => updateFormData({ specialRequests: e.target.value })}
              placeholder="Any special access requirements, timing constraints, or other details we should know"
              className="mt-2"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleSubmitQuote} 
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Submit Quote Request
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
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Quote Request Submitted!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Thank you, {formData.firstName}!
            </h3>
            <p className="text-green-700">
              Your free quote request for <strong>{service?.name}</strong> has been submitted successfully.
            </p>
          </div>

          <div className="text-left space-y-4">
            <h4 className="font-semibold text-gray-900">What happens next:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full p-1 text-xs font-bold min-w-[24px] h-6 flex items-center justify-center">1</div>
                <div>
                  <div className="font-medium">Contact within 2 hours</div>
                  <div className="text-sm text-gray-600">
                    We'll reach out via {formData.preferredContactMethod} to schedule your free assessment
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full p-1 text-xs font-bold min-w-[24px] h-6 flex items-center justify-center">2</div>
                <div>
                  <div className="font-medium">On-site assessment</div>
                  <div className="text-sm text-gray-600">
                    Our expert will visit your property to assess the project and provide detailed recommendations
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full p-1 text-xs font-bold min-w-[24px] h-6 flex items-center justify-center">3</div>
                <div>
                  <div className="font-medium">Detailed quote</div>
                  <div className="text-sm text-gray-600">
                    Receive a comprehensive quote with transparent pricing and project timeline
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Need immediate assistance?</span>
            </div>
            <p className="text-blue-700 text-sm">
              Call us at <strong>(555) 123-TAPS</strong> for urgent requests or questions.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/services'} 
              variant="outline" 
              className="w-full"
            >
              Browse Other Services
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
