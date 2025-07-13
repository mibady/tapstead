import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

// Valid fallback values for development/preview environments
const fallbackUrl = "https://xyzcompany.supabase.co"
const fallbackServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1MTkyNzIwLCJleHAiOjE5NjA3Njg3MjB9.M9jrxyvPLkUxWgOYSf5dNdJ8v_eRrZO6BZw-Ej2UU8F"

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return url.startsWith("https://") && url.includes(".supabase.co")
  } catch {
    return false
  }
}

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Use environment variables if valid, otherwise use fallbacks
  const url = supabaseUrl && isValidUrl(supabaseUrl) ? supabaseUrl : fallbackUrl
  const key = supabaseServiceKey && supabaseServiceKey.length > 50 ? supabaseServiceKey : fallbackServiceKey

  // Only log warnings in development
  if (process.env.NODE_ENV === "development") {
    if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
      console.warn("⚠️ Supabase URL not configured or invalid - using fallback")
    }
    if (!supabaseServiceKey || supabaseServiceKey.length < 50) {
      console.warn("⚠️ Supabase service key not configured - using fallback")
    }
  }

  return createSupabaseServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Named export required by deployment
export async function createServerClient() {
  return createClient()
}

export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return !!(supabaseUrl && supabaseServiceKey && isValidUrl(supabaseUrl) && supabaseServiceKey.length > 50)
}
