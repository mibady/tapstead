"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "user" | "provider" | "admin"
}

export function AuthGuard({ children, requiredRole = "user" }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasRequiredRole, setHasRequiredRole] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          // Not authenticated, redirect to login
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
          return
        }
        
        setIsAuthenticated(true)
        
        // Check user role if required
        if (requiredRole !== "user") {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
          
          if (error || !profile || profile.role !== requiredRole) {
            // User doesn't have the required role
            setHasRequiredRole(false)
            router.push("/unauthorized")
            return
          }
          
          setHasRequiredRole(true)
        } else {
          setHasRequiredRole(true)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        router.push("/login")
      } else if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true)
        checkAuth() // Re-check role when signed in
      }
    })
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [pathname, requiredRole, router])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Verifying your access...</span>
      </div>
    )
  }
  
  if (!isAuthenticated || !hasRequiredRole) {
    return null // Will redirect in the useEffect
  }
  
  return <>{children}</>
}

// Higher-order component to wrap protected pages
export function withAuth(Component: React.ComponentType<any>, role: "user" | "provider" | "admin" = "user") {
  return function ProtectedRoute(props: any) {
    return (
      <AuthGuard requiredRole={role}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
