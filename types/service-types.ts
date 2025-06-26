export type ServiceType = "bookable" | "quote-required" | "emergency"

export interface Service {
  id: string
  title: string
  description: string
  serviceType: ServiceType
  basePrice?: number // Only for bookable services
  priceRange?: { min: number; max: number } // For quote-required services
  duration?: string
  category: string
  icon: any
  features: string[]
  popular: boolean
  requiresAssessment: boolean
  emergencyAvailable: boolean
}

export interface QuoteRequest {
  id: string
  user_id: string
  service_id: string
  status: "pending" | "quoted" | "accepted" | "declined" | "expired"
  project_details: string
  address: string
  preferred_date: string
  preferred_time: string
  photos?: string[]
  estimated_budget?: number
  urgency: "standard" | "priority" | "urgent"
  created_at: string
  expires_at: string
}

export interface Quote {
  id: string
  quote_request_id: string
  provider_id: string
  total_price: number
  breakdown: QuoteLineItem[]
  description: string
  valid_until: string
  terms_conditions: string
  status: "sent" | "accepted" | "declined" | "expired"
  created_at: string
}

export interface QuoteLineItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}
