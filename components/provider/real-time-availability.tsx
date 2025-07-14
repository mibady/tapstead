"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Shield, Truck, Phone } from "lucide-react"
import { toast } from "sonner"

interface ProviderMatch {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance: number
  estimatedArrival: string
  militaryVeteran: boolean
  services: string[]
  pricing: {
    baseRate: number
    urgencyMultiplier: number
    travelFee: number
    totalEstimate: number
  }
  availability: {
    isAvailable: boolean
    nextAvailableSlot?: string
    availableSlots: Array<{ start: string; end: string }>
  }
  profileImage?: string
  businessName?: string
  yearsExperience?: number
  specialties?: string[]
}

interface SearchCriteria {
  serviceType: string
  location: {
    latitude: number
    longitude: number
    radius?: number
  }
  scheduledDate: string
  scheduledTime?: string
  urgency?: "standard" | "urgent" | "emergency"
  customerPreferences?: {
    militaryVeteran?: boolean
    minRating?: number
    maxDistance?: number
    priceRange?: { min: number; max: number }
  }
}

interface RealTimeAvailabilityProps {
  searchCriteria: SearchCriteria
  onProviderSelect?: (provider: ProviderMatch) => void
  onBookNow?: (provider: ProviderMatch) => void
}

export default function RealTimeAvailability({
  searchCriteria,
  onProviderSelect,
  onBookNow,
}: RealTimeAvailabilityProps) {
  const [providers, setProviders] = useState<ProviderMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchProviders = async () => {
    try {
      setError(null)
      const response = await fetch("/api/providers/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchCriteria),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to find providers")
      }

      setProviders(data.providers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      toast.error("Failed to load providers", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshAvailability = async () => {
    setRefreshing(true)
    await fetchProviders()
  }

  useEffect(() => {
    fetchProviders()
  }, [searchCriteria])

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatEstimatedArrival = (isoString: string) => {
    const arrivalTime = new Date(isoString)
    const now = new Date()
    const diffMinutes = Math.round((arrivalTime.getTime() - now.getTime()) / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes} min`
    } else {
      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Finding Available Providers...</h3>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <p className="font-medium">Unable to load providers</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
          <Button onClick={fetchProviders} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Available Providers ({providers.length})</h3>
          <p className="text-sm text-gray-600">
            {searchCriteria.scheduledTime
              ? `For ${searchCriteria.scheduledDate} at ${searchCriteria.scheduledTime}`
              : `For ${searchCriteria.scheduledDate}`}
          </p>
        </div>
        <Button onClick={refreshAvailability} variant="outline" size="sm" disabled={refreshing}>
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {searchCriteria.urgency && (
        <Badge className={getUrgencyColor(searchCriteria.urgency)}>
          {searchCriteria.urgency.charAt(0).toUpperCase() + searchCriteria.urgency.slice(1)} Service
        </Badge>
      )}

      {providers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">No providers available for your selected criteria.</p>
            <p className="text-sm text-gray-500">Try adjusting your date, time, or expanding your search radius.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className={`transition-all hover:shadow-md ${!provider.availability.isAvailable ? "opacity-75" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={provider.profileImage || "/placeholder.svg"} alt={provider.name} />
                      <AvatarFallback>
                        {provider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{provider.name}</h4>
                        {provider.militaryVeteran && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Veteran
                          </Badge>
                        )}
                      </div>

                      {provider.businessName && <p className="text-sm text-gray-600">{provider.businessName}</p>}

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{provider.rating.toFixed(1)}</span>
                          <span>({provider.reviewCount} reviews)</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{provider.distance} mi away</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Truck className="w-4 h-4" />
                          <span>ETA: {formatEstimatedArrival(provider.estimatedArrival)}</span>
                        </div>
                      </div>

                      {provider.specialties && provider.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.slice(0, 3).map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {provider.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-lg font-semibold text-green-600">${provider.pricing.totalEstimate}</div>
                          <div className="text-xs text-gray-500">
                            Base: ${provider.pricing.baseRate}
                            {provider.pricing.urgencyMultiplier > 1 && (
                              <span> • {Math.round((provider.pricing.urgencyMultiplier - 1) * 100)}% urgency</span>
                            )}
                            {provider.pricing.travelFee > 0 && <span> • ${provider.pricing.travelFee} travel</span>}
                          </div>
                        </div>

                        <div className="text-right">
                          {provider.availability.isAvailable ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Available
                            </Badge>
                          ) : (
                            <div className="space-y-1">
                              <Badge variant="secondary">Not Available</Badge>
                              {provider.availability.nextAvailableSlot && (
                                <div className="text-xs text-gray-500">
                                  Next: {formatTime(provider.availability.nextAvailableSlot)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onProviderSelect?.(provider)}>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>

                  <Button
                    onClick={() => onBookNow?.(provider)}
                    disabled={!provider.availability.isAvailable}
                    className={provider.availability.isAvailable ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {provider.availability.isAvailable ? "Book Now" : "Schedule Later"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
