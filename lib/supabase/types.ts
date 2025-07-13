export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_type: string
          status: string
          scheduled_date: string
          address: string
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_type: string
          status?: string
          scheduled_date: string
          address: string
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_type?: string
          status?: string
          scheduled_date?: string
          address?: string
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          user_id: string | null
          email: string
          phone: string
          service_type: string
          property_type: string
          bedrooms: number | null
          bathrooms: number | null
          square_footage: number | null
          address: string
          special_requests: string | null
          status: string
          estimated_price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          phone: string
          service_type: string
          property_type: string
          bedrooms?: number | null
          bathrooms?: number | null
          square_footage?: number | null
          address: string
          special_requests?: string | null
          status?: string
          estimated_price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          phone?: string
          service_type?: string
          property_type?: string
          bedrooms?: number | null
          bathrooms?: number | null
          square_footage?: number | null
          address?: string
          special_requests?: string | null
          status?: string
          estimated_price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
