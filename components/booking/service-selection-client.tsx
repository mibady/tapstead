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
import { Service } from "@/lib/services/service-data"

// Icon mapping based on service category
const categoryIconMap: Record<string, any> = {
  cleaning: Home,
  maintenance: Wrench,
  plumbing: Pipe,
  removal: Trash2,
  electrical: Zap,
  painting: Paintbrush,
  fabrication: Flame,
  emergency: Flame,
  handyman: Wrench,
  hvac: Waves,
  default: Home,
}

interface ServiceSelectionProps {
  onNext: (data: any) => void
  services: Service[]
}

export function ServiceSelectionClient({ onNext, services }: ServiceSelectionProps) {
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

  // Determine service type based on price and category
  const getServiceType = (service: Service): "bookable" | "quote-required" | "emergency" => {
    if (service.category?.toLowerCase().includes('emergency')) {
      return "emergency"
    } else if (service.base_price && service.base_price > 200) {
      return "quote-required"
    } else {
      return "bookable"
    }
  }

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case "bookable":
        return <Lightning className="w-3 h-3" />
      case "quote-required":
        return <Calculator className="w-3 h-3" />
      case "emergency":
        return <Flame className="w-3 h-3" />
      default:
        return <Calculator className="w-3 h-3" />
    }
  }

  const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
      case "bookable":
        return "Book Instantly"
      case "quote-required":
        return "Get Quote"
      case "emergency":
        return "Emergency"
      default:
        return "Get Quote"
    }
  }

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case "bookable":
        return "bg-green-500 hover:bg-green-600"
      case "quote-required":
        return "bg-blue-500 hover:bg-blue-600"
      case "emergency":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const getPriceDisplay = (service: Service) => {
    return `Starting at $${(service.base_price || 0).toFixed(2)}`
  }

  const getServiceIcon = (category: string) => {
    // Extract the primary category if multiple categories are provided
    const primaryCategory = category.split(',')[0].trim().toLowerCase()
    const IconComponent = categoryIconMap[primaryCategory] || categoryIconMap.default
    return IconComponent
  }

  // Extract features from category field (comma-separated values)
  const getServiceFeatures = (service: Service): string[] => {
    return (service.category || '')
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
  }

  // Check if service is popular
  const isPopular = (service: Service): boolean => {
    return service.category?.toLowerCase().includes('popular') || false
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What service do you need?</CardTitle>
          <CardDescription>
            Select the service you'd like. Some services can be booked instantly, others require a custom quote.
          </CardDescription>
        </CardHeader>
      </Card>

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <p>No services available at the moment. Please check back later.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => {
            const ServiceIcon = getServiceIcon(service.category || '')
            const serviceType = getServiceType(service)
            const features = getServiceFeatures(service)
            
            return (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedService === service.id ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => handleServiceSelect(service.id)}
              >
                <div className="absolute -top-2 left-4 flex gap-2">
                  {isPopular(service) && (
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <Badge className={getServiceTypeColor(serviceType)}>
                    {getServiceTypeIcon(serviceType)}
                    <span className="ml-1">{getServiceTypeLabel(serviceType)}</span>
                  </Badge>
                </div>

                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ServiceIcon className="w-6 h-6 text-blue-600" />
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
                  {features.length > 0 && (
                    <ul className="space-y-2">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {serviceType === "quote-required" && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center text-amber-700 text-sm">
                        <Calculator className="w-3 h-3 mr-2" />
                        <span>Requires on-site assessment for accurate pricing</span>
                      </div>
                    </div>
                  )}

                  {serviceType === "emergency" && (
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
                          Selected - {serviceType === "bookable" ? "Ready to book" : "Ready for quote request"}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {selectedService && (
        <div className="flex justify-end">
          <Button size="lg" onClick={handleContinue} variant="gradient">
            {(() => {
              const service = services.find(s => s.id === selectedService)
              if (!service) return "Continue"
              
              const serviceType = getServiceType(service)
              switch (serviceType) {
                case "emergency":
                  return "Request Emergency Service"
                case "quote-required":
                  return "Request Quote"
                default:
                  return "Continue to Book"
              }
            })()}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
