import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Validate required environment variables
if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
  throw new Error("Supabase URL is required. Please check your environment variables.")
}

if (!supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
  throw new Error("Supabase Anon Key is required. Please check your environment variables.")
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client for use in Server Components and API routes
export const createServerClient = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serverUrl || !serverKey) {
    throw new Error("Server-side Supabase configuration is missing")
  }

  return createClient<Database>(serverUrl, serverKey)
}
