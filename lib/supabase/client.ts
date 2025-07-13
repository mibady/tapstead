import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Valid fallback values for development/preview environments
const fallbackUrl = "https://xyzcompany.supabase.co"
const fallbackKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTE5MjcyMCwiZXhwIjoxOTYwNzY4NzIwfQ.M9jrxyvPLkUxWgOYSf5dNdJ8v_eRrZO6BZw-Ej2UU8E"

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return url.startsWith("https://") && url.includes(".supabase.co")
  } catch {
    return false
  }
}

// Use environment variables if valid, otherwise use fallbacks
const url = supabaseUrl && isValidUrl(supabaseUrl) ? supabaseUrl : fallbackUrl
const key = supabaseAnonKey && supabaseAnonKey.length > 50 ? supabaseAnonKey : fallbackKey

// Only log warnings in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
    console.warn("⚠️ NEXT_PUBLIC_SUPABASE_URL not configured or invalid - using fallback")
  }
  if (!supabaseAnonKey || supabaseAnonKey.length < 50) {
    console.warn("⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured - using fallback")
  }
}

export const supabase = createSupabaseClient(url, key, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
  },
})

// Named exports required by the deployment
export function createClient() {
  return createSupabaseClient(url, key, {
    auth: {
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
    },
  })
}

export function createServerClient() {
  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && supabaseAnonKey.length > 50)
}

export default supabase
