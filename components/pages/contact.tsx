"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, Mail, Clock, Send } from "lucide-react"
import { submitContactForm } from "@/lib/actions/contact-actions"

export function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setMessage("")

    const result = await submitContactForm(formData)

    if (result.success) {
      setMessage("Thank you! We'll get back to you within 24 hours.")
    } else {
      setMessage("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our services? We're here to help. Reach out to our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Phone</h3>
                </div>
                <a href="tel:13606417386" className="text-blue-600 font-medium hover:underline text-lg">(360) 641-7386</a>
                <p className="text-sm text-gray-500 mt-1">24/7 AI Assistant</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Email</h3>
                </div>
                <p className="text-gray-600">hello@tapstead.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Hours</h3>
                </div>
                <p className="text-gray-600">Mon-Fri: 7AM-7PM</p>
                <p className="text-gray-600">Sat-Sun: 8AM-6PM</p>
                <p className="text-red-600 font-medium">Emergency: 24/7</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={handleSubmit} className="space-y-4">
                  {message && (
                    <Alert>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select name="subject" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="booking">Booking Question</SelectItem>
                        <SelectItem value="emergency">Emergency Service</SelectItem>
                        <SelectItem value="provider">Become a Provider</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" rows={5} placeholder="Tell us how we can help..." required />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
