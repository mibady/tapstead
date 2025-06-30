import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Calendar, MessageSquare, Clock } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Two Ways to Get Started</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book home cleaning instantly online, or get a free quote for all other services with personalized assessment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Instant Booking */}
          <Card className="border-2 border-green-200 relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-green-100 text-green-800 text-center py-3 font-semibold">
              <Calendar className="inline w-4 h-4 mr-2" />
              Book Online Now
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-700">Home Cleaning</CardTitle>
              <CardDescription className="text-lg">
                Transparent pricing, instant booking, secure payment
              </CardDescription>
              <div className="text-3xl font-bold text-green-600 mt-4">$99 - $299</div>
              <p className="text-sm text-green-600">Based on home size and service type</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Fixed pricing - no surprises</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Same-day booking available</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Secure online payment</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Eco-friendly supplies included</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>100% satisfaction guarantee</span>
                </li>
              </ul>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6" asChild>
                <Link href="/book-now">Book Cleaning Now</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quote Required */}
          <Card className="border-2 border-blue-200 relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 text-blue-800 text-center py-3 font-semibold">
              <MessageSquare className="inline w-4 h-4 mr-2" />
              Free Quote & Assessment
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-700">All Other Services</CardTitle>
              <CardDescription className="text-lg">
                Custom pricing based on your specific project needs
              </CardDescription>
              <div className="text-3xl font-bold text-blue-600 mt-4">Free Quote</div>
              <p className="text-sm text-blue-600">Expert on-site assessment</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span>Expert on-site assessment</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span>Detailed project recommendations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span>Transparent pricing breakdown</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span>No obligation to proceed</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span>Professional consultation</span>
                </li>
              </ul>

              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded mb-4">
                <strong>Includes:</strong> Plumbing, Electrical, Handyman, Painting, Junk Removal, Emergency Services, and more
              </div>

              <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-lg py-6" asChild>
                <Link href="/book-now">Request Free Quote</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Questions about pricing?</p>
          <Button variant="outline" asChild>
            <Link href="/pricing">View Detailed Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
