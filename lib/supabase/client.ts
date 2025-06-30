import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Validate required environment variables
if (!supabaseUrl) {
  console.warn("Missing NEXT_PUBLIC_SUPABASE_URL environment variable - Supabase features will be disabled")
}

if (!supabaseAnonKey) {
  console.warn("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable - Supabase features will be disabled")
}

// Singleton Supabase client instance
let _supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Client-side Supabase client (browser)
const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables missing - client will be null")
    return null
  }
  
  if (!_supabaseClient) {
    _supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  
  return _supabaseClient
}

// Default client instance for convenience
export const supabase = createClient()

// Server-side client for use in Server Components and API routes
export const createServerClient = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serverUrl || !serverKey) {
    console.warn("Server-side Supabase configuration is missing - using client version")
    return supabase
  }

  return createSupabaseClient<Database>(serverUrl, serverKey)
}
