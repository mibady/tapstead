"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProviderLayout } from "@/components/provider/provider-layout"
import { ProviderDashboard } from "@/components/provider/provider-dashboard"
import { Loading } from "@/components/ui/loading"

export function ProviderPageClient() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login?redirect=/provider")
        return
      }

      // Check if user is a provider
      const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "provider") {
        router.push("/dashboard")
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  if (loading) {
    return <Loading />
  }

  return (
    <ProviderLayout>
      <ProviderDashboard />
    </ProviderLayout>
  )
}
