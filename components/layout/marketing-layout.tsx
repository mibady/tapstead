import type React from "react"
// Header is now included in ClientLayoutWrapper
import { Footer } from "./footer"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
      <Footer />
    </div>
  )
}
