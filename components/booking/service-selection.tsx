"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Wrench,
  Trash2,
  Droplets,
  Zap,
  Paintbrush,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Flame,
  PipetteIcon as Pipe,
  Waves,
  Calculator,
  CloudLightningIcon as Lightning,
} from "lucide-react"
import type { Service, ServiceType } from "@/types/service-types"

const services: Service[] = [
  {
    id: "house-cleaning",
    icon: Home,
    title: "House Cleaning",
    description: "Professional deep cleaning, regular maintenance, move-in/out cleaning with eco-friendly products",
    serviceType: "bookable",
    basePrice: 149,
    duration: "2-4 hours",
    category: "cleaning",
    popular: true,
    requiresAssessment: false,
    emergencyAvailable: false,
    features: ["Eco-friendly products", "Insured professionals", "Satisfaction guarantee", "Fixed pricing"],
    priceRange: { min: 149, max: 299 },
  },
  {
    id: "handyman",
    icon: Wrench,
    title: "Handyman Services",
    description: "Small repairs, installations, furniture assembly, home maintenance tasks",
    serviceType: "quote-required",
    priceRange: { min: 75, max: 300 },
    duration: "1-4 hours",
    category: "maintenance",
    popular: false,
    requiresAssessment: true,
    emergencyAvailable: true,
    features: ["Licensed professionals", "All tools included", "1-year warranty", "Custom quotes"],
  },
  {
    id: "plumbing",
    icon: Pipe,
    title: "Plumbing Services",
    description: "Leak repairs, drain cleaning, fixture installation, emergency plumbing services",
    serviceType: "quote-required",
    priceRange: { min: 89, max: 500 },
    duration: "1-6 hours",
    category: "plumbing",
    popular: false,
    requiresAssessment: true,
    emergencyAvailable: true,
    features: ["Licensed plumbers", "24/7 emergency service", "Parts warranty", "Upfront pricing"],
  },
  {
    id: "junk-removal",
    icon: Trash2,
    title: "Junk Removal",
    description: "Furniture, appliances, construction debris, estate cleanouts, eco-friendly disposal",
    serviceType: "quote-required",
    priceRange: { min: 149, max: 800 },
    duration: "1-4 hours",
    category: "removal",
    popular: false,
    requiresAssessment: true,
    emergencyAvailable: false,
    features: ["Same-day service", "Eco-friendly disposal", "No hidden fees", "Volume-based pricing"],
  },
  {
    id: "pressure-washing",
    icon: Droplets,
    title: "Pressure Washing",
    description: "Driveways, decks, siding, patios, and exterior surface cleaning",
    serviceType: "quote-required",
    priceRange: { min: 199, max: 600 },
    duration: "2-6 hours",
    category: "cleaning",
    popular: false,
    requiresAssessment: true,
    emergencyAvailable: false,
    features: ["Professional equipment", "Eco-safe detergents", "Before/after photos", "Surface-specific cleaning"],
  },
  {
    id: "gutter-services",
    icon: Waves,
    title: "Gutter Services",
    description: "Gutter cleaning, repairs, installation, downspout maintenance and protection",
    serviceType: "quote-required",
    priceRange: { min: 159, max: 450 },
    duration: "2-5 hours",
    category: "maintenance",
    popular: false,
    requiresAssessment: true,
    emergencyAvailable: false,
    features: ["Debris removal", "Leak repairs", "Gutter guards available", "Seasonal maintenance"],
  },
  {
    id: "electrical",
    icon: Zap,
    title: "Electrical Services",
    description: "Outlet installation, lighting, ceiling fans, smart home setup, electrical repairs",
    serviceType: "quote-required",
    priceRange: { min: 125, max: 1200 },
    duration: "1-8 hours",
    category: "electrical",
    popular: false,
    requiresAssessment: true,
    emergencyAvailable: true,
    features: ["Licensed electricians", "Code compliant", "Safety guaranteed", "Smart home integration"],
  },
  {
    id: "painting",
    icon: Paintbrush,
    title: "Interior Painting",
    description: "Room painting, touch-ups, color consultation, professional finish",
    serviceType: "quote-required",
    priceRange: { min: 299, max: 2500 },
    duration: "1-3 days",
    category: "painting",
    popular: false,
    requiresAssessment: true,
    emergencyAvailable: false,
    features: ["Premium paints", "Clean workspace", "Color matching", "Professional finish"],
  },
]

interface ServiceSelectionProps {
  onNext: (data: any) => void
}

export function ServiceSelection({ onNext }: ServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleContinue = () => {
    if (selectedService) {
      const service = services.find((s) => s.id === selectedService)
      onNext(service)
    }
  }

  const getServiceTypeIcon = (serviceType: ServiceType) => {
    switch (serviceType) {
      case "bookable":
        return <Lightning className="w-3 h-3" />
      case "quote-required":
        return <Calculator className="w-3 h-3" />
      case "emergency":
        return <Flame className="w-3 h-3" />
    }
  }

  const getServiceTypeLabel = (serviceType: ServiceType) => {
    switch (serviceType) {
      case "bookable":
        return "Book Instantly"
      case "quote-required":
        return "Get Quote"
      case "emergency":
        return "Emergency"
    }
  }

  const getServiceTypeColor = (serviceType: ServiceType) => {
    switch (serviceType) {
      case "bookable":
        return "bg-green-500 hover:bg-green-600"
      case "quote-required":
        return "bg-blue-500 hover:bg-blue-600"
      case "emergency":
        return "bg-red-500 hover:bg-red-600"
    }
  }

  const getPriceDisplay = (service: Service) => {
    if (service.serviceType === "bookable" && service.basePrice) {
      return `Starting at $${service.basePrice}`
    } else if (service.priceRange) {
      return `$${service.priceRange.min} - $${service.priceRange.max}`
    }
    return "Custom Quote"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What service do you need?</CardTitle>
          <CardDescription>
            House cleaning can be booked instantly with fixed pricing. Other services require custom quotes based on
            your specific needs.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedService === service.id ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
            }`}
            onClick={() => handleServiceSelect(service.id)}
          >
            <div className="absolute -top-2 left-4 flex gap-2">
              {service.popular && (
                <Badge className="bg-orange-500 hover:bg-orange-600">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              <Badge className={getServiceTypeColor(service.serviceType)}>
                {getServiceTypeIcon(service.serviceType)}
                <span className="ml-1">{getServiceTypeLabel(service.serviceType)}</span>
              </Badge>
            </div>

            <CardHeader className="pb-4 pt-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <service.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="font-semibold text-green-600">{getPriceDisplay(service)}</span>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-gray-600">{service.description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              {service.requiresAssessment && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center text-amber-700 text-sm">
                    <Calculator className="w-3 h-3 mr-2" />
                    <span>Custom quote based on your specific requirements</span>
                  </div>
                </div>
              )}

              {service.emergencyAvailable && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-700 text-sm">
                    <Flame className="w-3 h-3 mr-2" />
                    <span>24/7 Emergency service available</span>
                  </div>
                </div>
              )}

              {selectedService === service.id && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-700">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Selected -{" "}
                      {service.serviceType === "bookable" ? "Ready to book instantly" : "Ready for custom quote"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedService && (
        <div className="flex justify-end">
          <Button size="lg" onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
            {services.find((s) => s.id === selectedService)?.serviceType === "bookable"
              ? "Continue to Book"
              : "Request Quote"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
