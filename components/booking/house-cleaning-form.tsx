"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, Clock, DollarSign, Home, Info, PawPrint, Users, Repeat, Sparkles, Calendar, Wind, Construction } from "lucide-react"
import { Service } from "@/lib/services/service-data"
import { ServiceType } from "@/types/service-types"
import { calculatePrice } from "@/lib/pricing/house-cleaning-pricing"

interface HouseCleaningFormProps {
  onNext: (data: any) => void
  onBack: () => void
  service: Service & { serviceType?: ServiceType, icon?: any }
}

// Constants for pricing and time estimation
const BASE_HOURLY_RATE = 50

const addOnTimes = {
  insideFridge: 0.5,
  insideOven: 0.5,
  outsideCabinets: 0.5,
  topsOfCabinets: 1.0,
  windowInteriors: 1.0,
  blinds: 1.5,
  petHeavy: 0.5,
  finishedBasement: 1.0,
  postConstruction: 2.0,
}

export function HouseCleaningForm({ onNext, onBack, service }: HouseCleaningFormProps) {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    // Home Details
    address: "",
    bedrooms: "",
    bathrooms: "",
    finishedBasement: false,
    bonusRooms: 0,
    
    // Cleaning Type & Condition
    cleaningType: "deep-clean", // Default value
    isVacant: false,
    recentConstruction: false,
    currentCleanliness: 5, // Scale 1-10
    
    // Add-ons
    addOns: {
      insideFridge: false,
      insideOven: false,
      outsideCabinets: false,
      topsOfCabinets: false,
      windowInteriors: false,
      blinds: false,
    },
    
    // Pets
    pets: {
      dog: false,
      cat: false,
      other: false,
    },
    
    // Scheduling
    date: "",
    time: "",
    urgent: false,
    timePreference: "flexible",
    
    // Customer Profile
    returningCustomer: false,
    military: false,
    senior: false,
    newMover: false,
    
    // Subscription
    subscriptionTier: "one-time",
    
    // Additional Info
    specialInstructions: "",
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [estimatedDuration, setEstimatedDuration] = useState(0)

  useEffect(() => {
    const { estimatedPrice, estimatedDuration } = calculatePrice(formData);
    setEstimatedPrice(estimatedPrice);
    setEstimatedDuration(estimatedDuration);
  }, [formData]);
  
  // --- HANDLERS & VALIDATION ---
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return { ...prev, [parent]: { ...(prev as any)[parent], [child]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.bedrooms) newErrors.bedrooms = "Number of bedrooms is required";
    if (!formData.bathrooms) newErrors.bathrooms = "Number of bathrooms is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const { estimatedPrice, estimatedDuration } = calculatePrice(formData);
      onNext({
        ...formData,
        estimatedPrice: estimatedPrice,
        estimatedDuration: estimatedDuration,
        serviceType: "bookable"
      });
    }
  };

  // --- JSX RENDER ---
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {service.icon ? <service.icon className="w-6 h-6 mr-2 text-blue-600" /> : <Sparkles className="w-6 h-6 mr-2 text-blue-600" />}
            House Cleaning - Booking Details
          </CardTitle>
          <CardDescription>Fill out the details below to get an instant price estimate for your cleaning service.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* === LEFT COLUMN: FORM SECTIONS === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Home Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Home className="w-5 h-5 mr-2" />Home Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Input id="address" placeholder="123 Main St, Anytown, USA 12345" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} className={errors.address ? "border-red-500" : ""} />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
                    <SelectTrigger className={errors.bedrooms ? "border-red-500" : ""}><SelectValue placeholder="Select bedrooms" /></SelectTrigger>
                    <SelectContent>{[...Array(6)].map((_, i) => <SelectItem key={i+1} value={`${i+1}`}>{i+1} Bedroom{i > 0 ? 's' : ''}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
                    <SelectTrigger className={errors.bathrooms ? "border-red-500" : ""}><SelectValue placeholder="Select bathrooms" /></SelectTrigger>
                    <SelectContent>
                      {['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'].map(val => <SelectItem key={val} value={val}>{val} Bathroom{parseFloat(val) > 1 ? 's' : ''}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox id="finishedBasement" checked={formData.finishedBasement} onCheckedChange={(checked) => handleInputChange("finishedBasement", checked)} />
                    <Label htmlFor="finishedBasement">Include a Finished Basement?</Label>
                  </div>
                  <div>
                    <Label htmlFor="bonusRooms">Other Rooms (Office, Den, etc.)</Label>
                    <Select value={String(formData.bonusRooms)} onValueChange={(value) => handleInputChange("bonusRooms", parseInt(value))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{[...Array(4)].map((_, i) => <SelectItem key={i} value={`${i}`}>{i} Room{i !== 1 ? 's' : ''}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Cleaning Type & Condition */}
          <Card>
             <CardHeader>
                <CardTitle className="flex items-center text-lg"><Sparkles className="w-5 h-5 mr-2" />Cleaning Type & Condition</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                 <div>
                    <Label>What type of cleaning do you need?</Label>
                    <RadioGroup value={formData.cleaningType} onValueChange={(value) => handleInputChange("cleaningType", value)} className="grid grid-cols-2 gap-4 mt-2">
                        <Label className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent"><RadioGroupItem value="deep-clean" /> <span>Deep Clean</span></Label>
                        <Label className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent"><RadioGroupItem value="move-in-out" /> <span>Move-in / Move-out</span></Label>
                        <Label className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent"><RadioGroupItem value="standard-recurring" /> <span>Standard Recurring</span></Label>
                        <Label className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent"><RadioGroupItem value="post-construction" /> <span>Post-Construction</span></Label>
                    </RadioGroup>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                        <Checkbox id="recentConstruction" checked={formData.recentConstruction} onCheckedChange={(checked) => handleInputChange("recentConstruction", checked)} />
                        <Label htmlFor="recentConstruction">Any recent construction?</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                        <Checkbox id="isVacant" checked={formData.isVacant} onCheckedChange={(checked) => handleInputChange("isVacant", checked)} />
                        <Label htmlFor="isVacant">Is the home vacant?</Label>
                    </div>
                 </div>
                 <div>
                    <Label htmlFor="cleanliness">Current Cleanliness Level (1=Pristine, 10=Very Dirty)</Label>
                    <div className="flex items-center space-x-4">
                        <Slider id="cleanliness" min={1} max={10} step={1} value={[formData.currentCleanliness]} onValueChange={(value) => handleInputChange("currentCleanliness", value[0])} />
                        <Badge variant="secondary" className="w-12 justify-center">{formData.currentCleanliness}</Badge>
                    </div>
                 </div>
             </CardContent>
          </Card>

          {/* 3. Add-on Services */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><Wind className="w-5 h-5 mr-2" />Add-on Services</CardTitle>
                <CardDescription>Select extras. Each adds time and cost.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.keys(addOnTimes) as Array<keyof typeof addOnTimes>)
                    .filter(key => !['finishedBasement', 'petHeavy', 'postConstruction'].includes(key))
                    .map(key => (
                    <div key={key} className="flex items-center space-x-2 border rounded-md p-3">
                        <Checkbox id={key} checked={formData.addOns[key as keyof typeof formData.addOns]} onCheckedChange={(checked) => handleInputChange(`addOns.${key}`, checked)} />
                        <div>
                            <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                            <p className="text-sm text-gray-500">+{addOnTimes[key]} hr (+${addOnTimes[key] * BASE_HOURLY_RATE})</p>
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>

          {/* 4. Pets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><PawPrint className="w-5 h-5 mr-2" />Pets in the Home?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <Checkbox 
                    id="dog" 
                    checked={formData.pets.dog}
                    onCheckedChange={(checked) => handleInputChange("pets", { ...formData.pets, dog: checked })}
                  />
                  <Label htmlFor="dog">Dog(s)</Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <Checkbox 
                    id="cat" 
                    checked={formData.pets.cat}
                    onCheckedChange={(checked) => handleInputChange("pets", { ...formData.pets, cat: checked })}
                  />
                  <Label htmlFor="cat">Cat(s)</Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <Checkbox 
                    id="other" 
                    checked={formData.pets.other}
                    onCheckedChange={(checked) => handleInputChange("pets", { ...formData.pets, other: checked })}
                  />
                  <Label htmlFor="other">Other Pets</Label>
                </div>
              </div>
              {(formData.pets.dog || formData.pets.cat || formData.pets.other) && <p className="text-sm text-gray-500 mt-2">Pet hair fee applied: +{addOnTimes.petHeavy} hr (+${addOnTimes.petHeavy * BASE_HOURLY_RATE})</p>}
            </CardContent>
          </Card>

          {/* 5. Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Calendar className="w-5 h-5 mr-2" />Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date *</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} min={new Date().toISOString().split("T")[0]} className={errors.date ? "border-red-500" : ""} />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time *</Label>
                  <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                    <SelectTrigger className={errors.time ? "border-red-500" : ""}><SelectValue placeholder="Select time slot" /></SelectTrigger>
                    <SelectContent>{["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM"].map(time => <SelectItem key={time} value={time}>Starting around {time}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                  <Checkbox id="urgent" checked={formData.urgent} onCheckedChange={(checked) => handleInputChange("urgent", checked)} />
                  <div>
                    <Label htmlFor="urgent">Urgent request (needed within 24 hours)</Label>
                    <p className="text-xs text-gray-500">+30% surcharge will apply</p>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Customer Profile & Discounts */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><Users className="w-5 h-5 mr-2" />Customer Profile & Discounts</CardTitle>
                <CardDescription>Let us know if any of these apply to you.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 border rounded-md p-3"><Checkbox id="returningCustomer" checked={formData.returningCustomer} onCheckedChange={(checked) => handleInputChange("returningCustomer", checked)} /><Label htmlFor="returningCustomer">Returning Customer</Label></div>
                <div className="flex items-center space-x-2 border rounded-md p-3"><Checkbox id="newMover" checked={formData.newMover} onCheckedChange={(checked) => handleInputChange("newMover", checked)} /><Label htmlFor="newMover">New Mover</Label></div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                    <Checkbox id="military" checked={formData.military} onCheckedChange={(checked) => handleInputChange("military", checked)} />
                    <div><Label htmlFor="military">Military/Veteran</Label><p className="text-xs text-gray-500">10% discount</p></div>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                    <Checkbox id="senior" checked={formData.senior} onCheckedChange={(checked) => handleInputChange("senior", checked)} />
                    <div><Label htmlFor="senior">Senior (65+)</Label><p className="text-xs text-gray-500">10% discount</p></div>
                </div>
            </CardContent>
          </Card>

          {/* 7. Cleaning Frequency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Repeat className="w-5 h-5 mr-2" />Cleaning Frequency</CardTitle>
              <CardDescription>Save more with a recurring schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={formData.subscriptionTier} onValueChange={(value) => handleInputChange("subscriptionTier", value)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Label htmlFor="one-time" className="flex flex-col text-center border rounded-md p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary"><RadioGroupItem value="one-time" id="one-time" className="mb-2" /> <span className="font-medium">One-Time</span> <span className="text-sm text-gray-500">No discount</span></Label>
                  <Label htmlFor="monthly" className="flex flex-col text-center border rounded-md p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary"><RadioGroupItem value="monthly" id="monthly" className="mb-2" /> <span className="font-medium">Monthly</span> <span className="text-sm text-gray-500">10% Off</span></Label>
                  <Label htmlFor="biweekly" className="relative flex flex-col text-center border-2 border-primary rounded-md p-4 cursor-pointer bg-blue-50 hover:bg-blue-100"><Badge className="absolute -top-3">Popular</Badge><RadioGroupItem value="biweekly" id="biweekly" className="mb-2" /> <span className="font-medium">Biweekly</span> <span className="text-sm text-gray-500">20% Off</span></Label>
                  <Label htmlFor="weekly" className="flex flex-col text-center border rounded-md p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary"><RadioGroupItem value="weekly" id="weekly" className="mb-2" /> <span className="font-medium">Weekly</span> <span className="text-sm text-gray-500">30% Off</span></Label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* 8. Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Info className="w-5 h-5 mr-2" />Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="specialInstructions">Special Instructions or Areas to Focus On (Optional)</Label>
              <Textarea id="specialInstructions" placeholder="e.g., Please use the back door for entry. Focus on the baseboards in the living room." value={formData.specialInstructions} onChange={(e) => handleInputChange("specialInstructions", e.target.value)} rows={3} />
            </CardContent>
          </Card>
        </div>
        
        {/* === RIGHT COLUMN: PRICE SUMMARY === */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><DollarSign className="w-5 h-5 mr-2" />Price Estimate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Estimated Duration:</span>
                <Badge variant="outline" className="text-sm"><Clock className="w-4 h-4 mr-1.5" />{estimatedDuration} hours</Badge>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Estimated Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${estimatedPrice}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Final price may vary. Includes all taxes and fees.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* === FORM BUTTONS === */}
      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={onBack} className="flex items-center"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
        <Button type="button" onClick={handleSubmit} className="flex items-center" disabled={Object.keys(errors).length > 0}>Continue<ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  )
}
