import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientLayoutWrapper } from "@/components/layout/client-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tapstead.com'),
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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  )
}
