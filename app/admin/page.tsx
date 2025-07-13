"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Loading } from "@/components/ui/loading"

export default function AdminPage() {
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
        router.push("/login?redirect=/admin")
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "admin") {
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
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
