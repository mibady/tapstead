"use client"

import { ErrorLayout } from "@/components/layout/error-layout"
import { Header } from "@/components/layout/header"

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorLayout>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ErrorLayout>
  )
}