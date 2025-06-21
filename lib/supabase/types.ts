export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          customer_type: string
          military_status: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string
          customer_type?: string
          military_status?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          customer_type?: string
          military_status?: boolean
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_id: string
          provider_id: string | null
          status: string
          scheduled_date: string
          scheduled_time: string
          address: string
          special_instructions: string | null
          estimated_price: number
          final_price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          provider_id?: string | null
          status?: string
          scheduled_date: string
          scheduled_time: string
          address: string
          special_instructions?: string | null
          estimated_price: number
          final_price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          provider_id?: string | null
          status?: string
          scheduled_date?: string
          scheduled_time?: string
          address?: string
          special_instructions?: string | null
          estimated_price?: number
          final_price?: number | null
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          base_price: number
          duration: string
          category: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          base_price: number
          duration: string
          category: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          base_price?: number
          duration?: string
          category?: string
          active?: boolean
          updated_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          user_id: string
          business_name: string
          license_number: string
          insurance_verified: boolean
          rating: number
          total_jobs: number
          active: boolean
          location: string
          services: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          license_number: string
          insurance_verified?: boolean
          rating?: number
          total_jobs?: number
          active?: boolean
          location: string
          services: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          license_number?: string
          insurance_verified?: boolean
          rating?: number
          total_jobs?: number
          active?: boolean
          location?: string
          services?: string[]
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          status: string
          monthly_price: number
          next_billing_date: string
          services_included: string[]
          discount_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: string
          status?: string
          monthly_price: number
          next_billing_date: string
          services_included: string[]
          discount_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          status?: string
          monthly_price?: number
          next_billing_date?: string
          services_included?: string[]
          discount_percentage?: number
          updated_at?: string
        }
      }
      tracking: {
        Row: {
          id: string
          booking_id: string
          provider_id: string
          status: string
          location_lat: number | null
          location_lng: number | null
          estimated_arrival: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          provider_id: string
          status: string
          location_lat?: number | null
          location_lng?: number | null
          estimated_arrival?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          provider_id?: string
          status?: string
          location_lat?: number | null
          location_lng?: number | null
          estimated_arrival?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
    }
  }
}
