import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Database interface that mimics Prisma-like syntax but uses Supabase
export const db = {
  providerApplication: {
    create: async (data: { data: any }) => {
      const { data: result, error } = await supabase.from("provider_applications").insert(data.data).select().single()

      if (error) throw error
      return result
    },

    findUnique: async (query: { where: { id: string } }) => {
      const { data, error } = await supabase.from("provider_applications").select("*").eq("id", query.where.id).single()

      if (error && error.code !== "PGRST116") throw error
      return data
    },

    findMany: async (query?: any) => {
      const { data, error } = await supabase
        .from("provider_applications")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    },

    update: async (query: { where: { id: string }; data: any }) => {
      const { data, error } = await supabase
        .from("provider_applications")
        .update(query.data)
        .eq("id", query.where.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
  },

  provider: {
    create: async (data: { data: any }) => {
      const { data: result, error } = await supabase.from("providers").insert(data.data).select().single()

      if (error) throw error
      return result
    },
  },

  booking: {
    create: async (data: { data: any }) => {
      const { data: result, error } = await supabase.from("bookings").insert(data.data).select().single()

      if (error) throw error
      return result
    },

    findMany: async (query?: any) => {
      let supabaseQuery = supabase.from("bookings").select("*")

      if (query?.where?.user_id) {
        supabaseQuery = supabaseQuery.eq("user_id", query.where.user_id)
      }

      const { data, error } = await supabaseQuery.order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    },
  },

  user: {
    create: async (data: { data: any }) => {
      const { data: result, error } = await supabase.from("users").insert(data.data).select().single()

      if (error) throw error
      return result
    },

    findUnique: async (query: { where: { id?: string; email?: string } }) => {
      let supabaseQuery = supabase.from("users").select("*")

      if (query.where.id) {
        supabaseQuery = supabaseQuery.eq("id", query.where.id)
      } else if (query.where.email) {
        supabaseQuery = supabaseQuery.eq("email", query.where.email)
      }

      const { data, error } = await supabaseQuery.single()

      if (error && error.code !== "PGRST116") throw error
      return data
    },
  },
}
