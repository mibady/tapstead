import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tapstead - Home Services Made Simple | Just Tap. Done.",
  description:
    "Professional home services at your fingertips. Cleaning, handyman, junk removal, and more. Transparent pricing, trusted pros, instant booking.",
  keywords: "home services, cleaning, handyman, junk removal, home maintenance, professional services",
  openGraph: {
    title: "Tapstead - Home Services Made Simple",
    description: "Professional home services at your fingertips. Just tap. Done.",
    images: ["/images/tapstead-logo.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
