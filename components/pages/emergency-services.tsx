"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Clock, Shield, AlertTriangle, Flame, Zap, Wrench, Home } from "lucide-react"
import Link from "next/link"

export function EmergencyServices() {
  const emergencyServices = [
    {
      title: "Fire Debris Removal",
      description: "24/7 fire damage cleanup and debris removal",
      icon: Flame,
      phone: "(555) FIRE-911",
      href: "/services/fire-debris-removal",
      severity: "critical",
    },
    {
      title: "Emergency Plumbing",
      description: "Burst pipes, flooding, and urgent plumbing issues",
      icon: Wrench,
      phone: "(555) PLUMB-911",
      href: "/services/plumbing",
      severity: "urgent",
    },
    {
      title: "Emergency Electrical",
      description: "Power outages, electrical hazards, and urgent repairs",
      icon: Zap,
      phone: "(555) SPARK-911",
      href: "/services/electrical",
      severity: "urgent",
    },
    {
      title: "Storm Damage Cleanup",
      description: "Wind, hail, and storm damage restoration",
      icon: Home,
      phone: "(555) STORM-911",
      href: "/book-now?service=storm-damage",
      severity: "urgent",
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Emergency Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Emergency Services</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            24/7 emergency response for urgent home disasters and safety issues
          </p>
          <div className="mt-6">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              Call Emergency Hotline: (555) DISASTER
            </Button>
          </div>
        </div>

        {/* Emergency Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {emergencyServices.map((service) => (
            <Card key={service.title} className="border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <service.icon className="w-8 h-8 text-red-600" />
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <Badge className={service.severity === "critical" ? "bg-red-600" : "bg-orange-600"}>
                    {service.severity.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription className="text-lg">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Available 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Licensed & Insured</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="bg-red-600 hover:bg-red-700 flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      {service.phone}
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={service.href}>Learn More</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Response Process */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Emergency Response Process</CardTitle>
            <CardDescription className="text-center">
              Our rapid response protocol ensures help arrives quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Call Emergency Line</h3>
                <p className="text-sm text-gray-600">24/7 emergency hotline connects you instantly</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Rapid Assessment</h3>
                <p className="text-sm text-gray-600">Emergency coordinator evaluates situation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Immediate Dispatch</h3>
                <p className="text-sm text-gray-600">Certified emergency team dispatched within 30 minutes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">4. Professional Service</h3>
                <p className="text-sm text-gray-600">Licensed professionals handle emergency safely</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
