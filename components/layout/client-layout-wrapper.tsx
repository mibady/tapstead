"use client"

import { AuthProvider } from "@/lib/auth/auth-context"
import { ErrorLayout } from "@/components/layout/error-layout"
import { Header } from "@/components/layout/header"

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ErrorLayout>
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </ErrorLayout>
    </AuthProvider>
  )
}
