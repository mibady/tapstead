"use client"

import { useEffect, useState } from "react"
import { ServiceSelectionClient } from "./service-selection-client"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Service } from "@/lib/services/service-data"
import { supabase } from "@/lib/supabase/client"

interface ServiceSelectionProps {
  onNext: (data: any) => void
}

export function ServiceSelection({ onNext }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("active", true)
          .order("title")
        
        if (error) {
          console.error("Error fetching services:", error)
          return
        }
        
        setServices(data || [])
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchServices()
  }, [])
  
  if (loading) {
    return <ServiceSelectionSkeleton />
  }
  
  return <ServiceSelectionClient services={services} onNext={onNext} />
}

function ServiceSelectionSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What service do you need?</CardTitle>
          <CardDescription>
            Select the service you'd like. Some services can be booked instantly, others require a custom quote.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-5/6 mt-2" />
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
