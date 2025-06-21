"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth/auth-context"
import { supabase } from "@/lib/supabase/client"
import { User, Bell, Shield, Save } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    customer_type: "",
    military_status: false,
  })
  const [notifications, setNotifications] = useState({
    email_bookings: true,
    email_promotions: false,
    sms_reminders: true,
    sms_updates: true,
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data } = await supabase.from("users").select("*").eq("id", user?.id).single()

      if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          customer_type: data.customer_type || "",
          military_status: data.military_status || false,
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.from("users").update(profile).eq("id", user?.id)

      if (error) throw error

      setMessage("Profile updated successfully!")
    } catch (error) {
      setMessage("Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))

    try {
      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user?.id,
        [key]: value,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error updating notifications:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and information</p>
        </div>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.first_name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.last_name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user?.email || ""} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <Select
                  value={profile.customer_type}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, customer_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homeowner">Homeowner</SelectItem>
                    <SelectItem value="renter">Renter</SelectItem>
                    <SelectItem value="property-manager">Property Manager</SelectItem>
                    <SelectItem value="real-estate">Real Estate Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="military"
                  checked={profile.military_status}
                  onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, military_status: checked }))}
                />
                <Label htmlFor="military">Military/Veteran Status</Label>
              </div>

              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Email Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Booking Confirmations</Label>
                    <p className="text-sm text-gray-500">Get notified when bookings are confirmed</p>
                  </div>
                  <Switch
                    checked={notifications.email_bookings}
                    onCheckedChange={(checked) => handleNotificationUpdate("email_bookings", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Promotions & Offers</Label>
                    <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                  </div>
                  <Switch
                    checked={notifications.email_promotions}
                    onCheckedChange={(checked) => handleNotificationUpdate("email_promotions", checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">SMS Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Service Reminders</Label>
                    <p className="text-sm text-gray-500">Get reminded before scheduled services</p>
                  </div>
                  <Switch
                    checked={notifications.sms_reminders}
                    onCheckedChange={(checked) => handleNotificationUpdate("sms_reminders", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Service Updates</Label>
                    <p className="text-sm text-gray-500">Real-time updates about your service</p>
                  </div>
                  <Switch
                    checked={notifications.sms_updates}
                    onCheckedChange={(checked) => handleNotificationUpdate("sms_updates", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Change Password</Button>
            <Button variant="outline">Enable Two-Factor Authentication</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
