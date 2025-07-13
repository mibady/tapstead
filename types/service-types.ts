export type ServiceType = "bookable" | "quote-required" | "emergency"

export interface Service {
  id: string
  icon: any
  title: string
  description: string
  serviceType: ServiceType
  basePrice?: number
  priceRange?: {
    min: number
    max: number
  }
  duration: string
  category: string
  popular: boolean
  requiresAssessment: boolean
  emergencyAvailable: boolean
  features: string[]
}

export interface BookingPricing {
  basePrice: {
    small: number // 1-2 bedrooms
    medium: number // 3-4 bedrooms
    large: number // 5+ bedrooms
  }
  subscriptionDiscount: {
    weekly: number // 33% off base
    biweekly: number // 27% off base
    monthly: number // 20% off base
  }
  addOns: {
    deepClean: number
    moveInOut: number
    insideOven: number
    insideFridge: number
    interiorWindows: number
    garageCleaning: number
  }
  dynamicPricing: {
    weekend: number // +10%
    sameDay: number // +15%
    holiday: number // +20%
  }
}

export interface QuoteRequest {
  id: string
  userId: string
  serviceType: string
  description: string
  photos: string[]
  address: string
  propertyType?: string
  propertySize?: string
  preferredDate: string
  preferredTime?: string
  urgency: string
  estimatedBudget?: string
  status: "pending" | "quoted" | "accepted" | "declined"
  createdAt: Date
  updatedAt: Date
}

export interface Quote {
  id: string
  requestId: string
  basePrice: number
  adjustments: {
    item: string
    amount: number
  }[]
  finalPrice: number
  validUntil: Date
  notes: string
  status: "pending" | "sent" | "accepted" | "declined"
  createdAt: Date
}
