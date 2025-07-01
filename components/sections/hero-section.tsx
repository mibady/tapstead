import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Clock, Phone, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Insured & Bonded
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Star className="w-3 h-3 mr-1" />
                4.9/5 Rating
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Clock className="w-3 h-3 mr-1" />
                Same-Day Service
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Just Tap.
                <br />
                <span className="text-blue-600">Done.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Professional home services at your fingertips. Transparent pricing, trusted pros, instant booking. Skip
                the hassle—just tap.
              </p>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="text-center sm:text-left">
                <div className="font-semibold text-gray-900">Upfront Pricing</div>
                <div className="text-gray-600">No surprises, no hidden fees</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-semibold text-gray-900">Vetted Pros</div>
                <div className="text-gray-600">Background checked & insured</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-semibold text-gray-900">60-Second Booking</div>
                <div className="text-gray-600">Book in 60 seconds. Live in peace.</div>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg">24/7 Customer Support</div>
                  <a href="tel:13606417386" className="text-blue-600 font-bold text-2xl hover:underline">
                    (360) 641-7386
                  </a>
                  <div className="text-sm text-gray-600">Booking • Support • Emergencies</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="gradient" className="text-lg px-8 py-6" asChild>
                <Link href="/book-now">Book Service Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">10,000+</span> Happy Customers
              </div>
              <div>
                <span className="font-semibold text-gray-900">50,000+</span> Jobs Completed
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <Image
              src="/images/hero-homeowner.png"
              alt="Professional homeowner booking services on Tapstead"
              width={600}
              height={500}
              className="w-full h-auto rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
