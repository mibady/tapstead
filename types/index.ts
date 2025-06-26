export interface User {
  id: string
  email: string
  name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  category: string
  price_range: string
  duration: string
  availability: boolean
}

export interface Booking {
  id: string
  user_id: string
  service_id: string
  provider_id?: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  scheduled_date: string
  address: string
  notes?: string
  total_amount?: number
  created_at: string
  updated_at: string
}

export interface Provider {
  id: string
  name: string
  email: string
  phone: string
  services: string[]
  rating: number
  reviews_count: number
  verified: boolean
  created_at: string
}
