"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Header is now included in ClientLayoutWrapper
import { Footer } from "@/components/layout/footer"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Check your email for the password reset link")
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Reset Your Password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm text-blue-600 hover:underline flex items-center justify-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                    <p className="text-gray-600 mb-4">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button onClick={() => setSent(false)} variant="outline" className="w-full">
                      Try Different Email
                    </Button>
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full">
                        Back to Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
