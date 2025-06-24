export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          estimated_duration: number | null
          hourly_rate: number | null
          id: string
          provider_id: string | null
          scheduled_date: string | null
          service_type: string
          special_instructions: string | null
          state: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          estimated_duration?: number | null
          hourly_rate?: number | null
          id?: string
          provider_id?: string | null
          scheduled_date?: string | null
          service_type: string
          special_instructions?: string | null
          state?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          estimated_duration?: number | null
          hourly_rate?: number | null
          id?: string
          provider_id?: string | null
          scheduled_date?: string | null
          service_type?: string
          special_instructions?: string | null
          state?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          active: boolean | null
          business_name: string | null
          created_at: string | null
          id: string
          insurance_verified: boolean | null
          license_number: string | null
          location: string | null
          rating: number | null
          services: string[] | null
          total_jobs: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          insurance_verified?: boolean | null
          license_number?: string | null
          location?: string | null
          rating?: number | null
          services?: string[] | null
          total_jobs?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          insurance_verified?: boolean | null
          license_number?: string | null
          location?: string | null
          rating?: number | null
          services?: string[] | null
          total_jobs?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          base_price: number | null
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          id: string
          monthly_price: number | null
          next_billing_date: string | null
          plan_type: string | null
          services_included: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: string | null
          services_included?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: string | null
          services_included?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          provider_id: string | null
          status: string | null
          timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          provider_id?: string | null
          status?: string | null
          timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          provider_id?: string | null
          status?: string | null
          timestamp?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
