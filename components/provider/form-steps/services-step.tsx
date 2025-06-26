import React from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProviderFormData } from "@/hooks/use-provider-form"
import { serviceCategories } from "@/data/service-categories"

interface ServicesStepProps {
  formData: ProviderFormData
  onServiceToggle: (serviceId: string) => void
  onInputChange: (field: string, value: any) => void
}

const SERVICE_AREAS = [
  "Birmingham", "Huntsville", "Mobile", "Montgomery", "Tuscaloosa",
  "Auburn", "Dothan", "Decatur", "Madison", "Florence"
]

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

export function ServicesStep({ formData, onServiceToggle, onInputChange }: ServicesStepProps) {
  const handleAvailabilityChange = (day: string, checked: boolean) => {
    onInputChange("availability", {
      ...formData.availability,
      [day]: checked,
    })
  }

  const handleServiceAreaToggle = (area: string) => {
    const currentAreas = formData.serviceAreas
    const newAreas = currentAreas.includes(area)
      ? currentAreas.filter(a => a !== area)
      : [...currentAreas, area]
    
    onInputChange("serviceAreas", newAreas)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Services & Availability</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the services you offer and specify your availability and service areas.
        </p>
      </div>

      {/* Service Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Categories</CardTitle>
          <CardDescription>
            Select all services you can provide. You can always add more later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceCategories.map((service) => (
              <div 
                key={service.id} 
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={service.id}
                  checked={formData.selectedServices.includes(service.id)}
                  onCheckedChange={() => onServiceToggle(service.id)}
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={service.id} 
                    className="font-medium cursor-pointer"
                  >
                    {service.name}
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    {service.baseRate}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {formData.selectedServices.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Selected Services:</p>
              <div className="flex flex-wrap gap-2">
                {formData.selectedServices.map((serviceId) => {
                  const service = serviceCategories.find(s => s.id === serviceId)
                  return service ? (
                    <Badge key={serviceId} variant="secondary">
                      {service.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Areas</CardTitle>
          <CardDescription>
            Select the cities and areas where you can provide services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SERVICE_AREAS.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={`area-${area}`}
                  checked={formData.serviceAreas.includes(area)}
                  onCheckedChange={() => handleServiceAreaToggle(area)}
                />
                <Label 
                  htmlFor={`area-${area}`} 
                  className="text-sm cursor-pointer"
                >
                  {area}
                </Label>
              </div>
            ))}
          </div>

          {formData.serviceAreas.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Service Areas:</p>
              <div className="flex flex-wrap gap-2">
                {formData.serviceAreas.map((area) => (
                  <Badge key={area} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
          <CardDescription>
            Select the days you're generally available to work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.key} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${day.key}`}
                  checked={formData.availability[day.key as keyof typeof formData.availability]}
                  onCheckedChange={(checked) => handleAvailabilityChange(day.key, !!checked)}
                />
                <Label 
                  htmlFor={`availability-${day.key}`} 
                  className="text-sm cursor-pointer"
                >
                  {day.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is your general availability. You can set specific hours 
              and manage your calendar once your application is approved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}