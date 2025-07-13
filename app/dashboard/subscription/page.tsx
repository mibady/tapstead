"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SubscriptionManager } from "@/components/subscription/subscription-manager"
import { Loading } from "@/components/ui/loading"

export default function SubscriptionPage() {
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
        router.push("/login?redirect=/dashboard/subscription")
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
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
          <p className="text-gray-600">Manage your subscription and billing</p>
        </div>
        <SubscriptionManager />
      </div>
    </DashboardLayout>
  )
}
