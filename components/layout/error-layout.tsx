"use client"

import { ReactNode } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home } from "lucide-react"
import Link from "next/link"

interface ErrorLayoutProps {
  children: ReactNode
}

/**
 * Global error layout wrapper that catches errors in any child component
 * and displays a user-friendly error message with options to recover
 */
export function ErrorLayout({ children }: ErrorLayoutProps) {
  const handleReset = () => {
    // Force a refresh of the page
    window.location.reload()
  }

  const fallbackUI = (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <Alert variant="destructive" className="mb-6 max-w-lg">
        <AlertCircle className="h-5 w-5 mr-2" />
        <div className="font-medium text-lg">Something went wrong</div>
        <AlertDescription className="mt-2">
          We encountered an unexpected error. Our team has been notified and is working to fix the issue.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button onClick={handleReset} className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallbackUI}>
      {children}
    </ErrorBoundary>
  )
}
