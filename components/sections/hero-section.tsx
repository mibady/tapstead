"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Shield, Clock, CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                4.9/5 Rating
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                Insured & Bonded
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                House Cleaning.
                <br />
                <span className="text-blue-600">Just Tap.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Professional house cleaning with fixed pricing and instant booking. Plus custom quotes for all your
                other home service needs.
              </p>
            </div>

            {/* Pricing Highlight */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">House Cleaning Pricing</h3>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">$149</div>
                  <div className="text-sm text-gray-600">Small Home</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">$199</div>
                  <div className="text-sm text-gray-600">Medium Home</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">$299</div>
                  <div className="text-sm text-gray-600">Large Home</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800 font-medium">Save with subscriptions:</div>
                <div className="text-sm text-green-700">Weekly 33% • Bi-weekly 27% • Monthly 20%</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]" asChild>
                <Link href="/book-now">
                  Book House Cleaning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="min-w-[160px] bg-transparent" asChild>
                <Link href="/services">View All Services</Link>
              </Button>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Same-day available</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">All supplies included</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Eco-friendly products</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Satisfaction guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/images/hero-couple.png"
                alt="Happy couple in clean home"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>

            {/* Floating Cards */}
            <Card className="absolute -top-4 -left-4 z-20 bg-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold">Next Available</div>
                    <div className="text-xs text-gray-600">Today 2:00 PM</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="absolute -bottom-4 -right-4 z-20 bg-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">1,200+ Reviews</div>
                    <div className="text-xs text-gray-600">4.9/5 Average</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-2xl transform rotate-3 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
