import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight, DollarSign, Clock, Shield, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"



export function PricingOverview() {
  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Two Ways to Get Started</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Book home cleaning instantly online with transparent pricing, or request a free quote for all other services with personalized on-site assessments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/book-now">Book Cleaning Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/book-now">Request Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Types Explanation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Pricing Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer two types of services with different pricing approaches to best serve your needs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Instant Booking */}
            <Card className="border-2 border-green-200 relative overflow-hidden">
              <div className="bg-green-100 text-green-800 text-center py-2 font-medium">
                Book Online & Pay Now
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Home Cleaning
                </CardTitle>
                <CardDescription className="text-lg">
                  Transparent pricing, instant booking, secure online payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 mb-1">$99 - $299</div>
                  <div className="text-sm text-green-600">Based on home size and service type</div>
                </div>
                
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Fixed pricing - no surprises</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Same-day booking available</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Secure online payment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Eco-friendly supplies included</span>
                  </li>
                </ul>

                <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/book-now">Book Cleaning Online</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quote Required */}
            <Card className="border-2 border-blue-200 relative overflow-hidden">
              <div className="bg-blue-100 text-blue-800 text-center py-2 font-medium">
                Free Quote & Assessment
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  All Other Services
                </CardTitle>
                <CardDescription className="text-lg">
                  Custom pricing based on your specific needs and project scope
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 mb-1">Free Quote</div>
                  <div className="text-sm text-blue-600">On-site assessment & detailed estimate</div>
                </div>
                
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Expert on-site assessment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Detailed project recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Transparent pricing breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">No obligation to proceed</span>
                  </li>
                </ul>

                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Includes:</strong> Plumbing, Electrical, Handyman, Gutter Services, 
                  Pressure Washing, Painting, Junk Removal, Welding, Emergency Services
                </div>

                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
                  <Link href="/book-now">Request Free Quote</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Home Cleaning Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Home Cleaning Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent, fixed pricing for professional home cleaning services
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-green-700">Home Cleaning Services</CardTitle>
                <CardDescription className="text-center text-lg">
                  Professional cleaning with eco-friendly products and satisfaction guarantee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Standard Cleaning */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Standard Cleaning</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">1-2 Bedroom Home</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            2-3 hours
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">$99-129</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">3-4 Bedroom Home</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            3-4 hours
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">$149-199</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">5+ Bedroom Home</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            4-5 hours
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">$199-299</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Services */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Premium Services</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Deep Cleaning</div>
                          <div className="text-sm text-gray-600">+50% standard rate</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">$149-449</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Move-in/out Cleaning</div>
                          <div className="text-sm text-gray-600">+80% standard rate</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">$178-538</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Recurring Service</div>
                          <div className="text-sm text-gray-600">Weekly, bi-weekly, monthly</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-purple-600">Save 5-15%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">What's Included:</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>All rooms and bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Kitchen and appliances</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Dusting and vacuuming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Eco-friendly supplies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Insured professionals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Satisfaction guarantee</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/book-now">Book Your Cleaning Service</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Tapstead</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional service, transparent pricing, and satisfaction guaranteed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Instant Booking</h3>
                <p className="text-gray-600">
                  Book home cleaning online with same-day availability and secure payment.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Free Assessments</h3>
                <p className="text-gray-600">
                  Get detailed quotes for complex projects with expert on-site evaluations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Satisfaction Guaranteed</h3>
                <p className="text-gray-600">
                  All services backed by our 100% satisfaction guarantee and insurance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Guarantees */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Pricing Promise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in transparent, fair pricing with no surprises
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Hidden Fees</h3>
                <p className="text-gray-600">
                  The price you see is the price you pay. All materials, labor, and taxes included.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Price Match Guarantee</h3>
                <p className="text-gray-600">
                  Find a lower price for the same service? We'll match it and beat it by 10%.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Satisfaction Guarantee</h3>
                <p className="text-gray-600">Not happy with the service? We'll make it right or refund your money.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
