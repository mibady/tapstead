import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { AuthProvider } from '@/lib/auth/auth-context'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tapstead",
  description: "Home Services Made Simple",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 relative">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}