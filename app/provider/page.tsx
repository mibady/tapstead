"use client"

import { useEffect, useState } from "react"
import { ProviderLayout } from "@/components/provider/provider-layout"
import { ProviderDashboard } from "@/components/provider/provider-dashboard"
import { useAuth } from "@/lib/auth/auth-context"
import { supabase } from "@/lib/supabase/client"

export default function ProviderDashboardPage() {
  const { user } = useAuth()
  const [provider, setProvider] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [earnings, setEarnings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProviderData()
    }
  }, [user])

  const fetchProviderData = async () => {
    if (!supabase || !user?.id) {
      setLoading(false)
      return
    }
    
    try {
      // Fetch provider profile
      const { data: providerData } = await supabase.from("providers").select("*").eq("user_id", user.id).single()

      // Fetch recent jobs
      const { data: jobsData } = await supabase
        .from("bookings")
        .select(`
          *,
          services (title, category),
          users (first_name, last_name, phone)
        `)
        .eq("provider_id", providerData?.id)
        .order("scheduled_date", { ascending: false })
        .limit(10)

      // Calculate earnings
      const totalEarnings = jobsData?.reduce((sum, job) => sum + (job.final_price || job.estimated_price), 0) || 0

      setProvider(providerData)
      setJobs(jobsData || [])
      setEarnings(totalEarnings)
    } catch (error) {
      console.error("Error fetching provider data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProviderLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProviderLayout>
    )
  }

  return (
    <ProviderLayout>
      <ProviderDashboard provider={provider} jobs={jobs} earnings={earnings} />
    </ProviderLayout>
  )
}
