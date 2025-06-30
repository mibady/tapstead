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
      agent_conversations: {
        Row: {
          id: string
          user_id: string | null
          agent_type: string
          session_id: string
          messages: Json
          context_data: Json | null
          user_email: string | null
          user_role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          agent_type: string
          session_id: string
          messages?: Json
          context_data?: Json | null
          user_email?: string | null
          user_role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          agent_type?: string
          session_id?: string
          messages?: Json
          context_data?: Json | null
          user_email?: string | null
          user_role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      agent_interactions: {
        Row: {
          id: string
          agent_type: string
          user_id: string | null
          session_id: string | null
          tool_used: string | null
          success: boolean | null
          response_time_ms: number | null
          error_message: string | null
          user_input: string | null
          agent_response: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          agent_type: string
          user_id?: string | null
          session_id?: string | null
          tool_used?: string | null
          success?: boolean | null
          response_time_ms?: number | null
          error_message?: string | null
          user_input?: string | null
          agent_response?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          agent_type?: string
          user_id?: string | null
          session_id?: string | null
          tool_used?: string | null
          success?: boolean | null
          response_time_ms?: number | null
          error_message?: string | null
          user_input?: string | null
          agent_response?: string | null
          created_at?: string | null
        }
      }
      provider_applications: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          company_name: string | null
          services: string[]
          experience_years: number
          license_number: string | null
          insurance_provider: string | null
          coverage_amount: number | null
          service_areas: string[]
          availability: Json
          emergency_services: boolean | null
          background_check_consent: boolean
          terms_accepted: boolean
          additional_info: string | null
          status: string | null
          admin_notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          company_name?: string | null
          services: string[]
          experience_years: number
          license_number?: string | null
          insurance_provider?: string | null
          coverage_amount?: number | null
          service_areas: string[]
          availability: Json
          emergency_services?: boolean | null
          background_check_consent: boolean
          terms_accepted: boolean
          additional_info?: string | null
          status?: string | null
          admin_notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          company_name?: string | null
          services?: string[]
          experience_years?: number
          license_number?: string | null
          insurance_provider?: string | null
          coverage_amount?: number | null
          service_areas?: string[]
          availability?: Json
          emergency_services?: boolean | null
          background_check_consent?: boolean
          terms_accepted?: boolean
          additional_info?: string | null
          status?: string | null
          admin_notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
