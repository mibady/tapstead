import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Star,
  CheckCircle,
  Shield,
  ArrowRight,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Service } from "@/lib/services/service-data"

interface ServiceDetailProps {
  service: Service
  isEmergency?: boolean
}

export function ServiceDetail({ service, isEmergency = false }: ServiceDetailProps) {
  const priceDisplay = `Starting at $${(service.base_price || 0).toFixed(2)}`
  
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className={`py-16 ${isEmergency ? 'bg-red-50' : 'bg-blue-50'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center mb-4">
                {isEmergency && (
                  <Badge className="bg-red-600 hover:bg-red-700 mr-3">Emergency Service</Badge>
                )}
                <h1 className="text-4xl font-bold text-gray-900">{service.title}</h1>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-1" />
                  <span className="font-semibold text-green-600">{priceDisplay}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-600 mr-1" />
                  <span>{service.duration}</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 mb-8">{service.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className={isEmergency ? "bg-red-600 hover:bg-red-700" : ""}
                  variant={isEmergency ? undefined : "gradient"}
                  asChild
                >
                  <Link href={`/book-now?service=${service.id}${isEmergency ? '&emergency=true' : ''}`}>
                    {isEmergency ? 'Request Emergency Service' : 'Book Now'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative min-h-[300px]">
              <Image 
                src={`/images/services/${(service.category || 'default').toLowerCase()}.jpg`}
                alt={service.title || 'Service image'}
                fill
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                <ul className="space-y-4">
                  {[
                    "Professional equipment and supplies",
                    "Licensed and insured technicians",
                    "100% satisfaction guarantee",
                    "Flexible scheduling options",
                    "Transparent pricing",
                    "Detailed service report"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
                <ul className="space-y-4">
                  {[
                    "Fully licensed and insured professionals",
                    "Background-checked and vetted technicians",
                    "Satisfaction guarantee on all services",
                    "Transparent pricing with no hidden fees",
                    "Flexible scheduling including weekends",
                    "24/7 customer support"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <Shield className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Book Online</h3>
              <p className="text-gray-600">
                Schedule your service online in minutes. Choose a date and time that works for you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Meet Your Pro</h3>
              <p className="text-gray-600">
                Our vetted professional will arrive on time and ready to provide excellent service.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Satisfaction Guaranteed</h3>
              <p className="text-gray-600">
                Enjoy your perfectly completed service, backed by our 100% satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your {(service.title || 'service').toLowerCase()} service today and experience the Tapstead difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gradient" asChild>
              <Link href={`/book-now?service=${service.id}`}>
                Book Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {isEmergency && (
        <section className="py-12 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="flex items-start p-6 border border-red-300 rounded-lg bg-white">
              <AlertTriangle className="w-12 h-12 text-red-600 mr-6 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Emergency Response Information</h3>
                <p className="text-gray-700 mb-4">
                  For immediate assistance with {(service.title || 'this service').toLowerCase()}, please call our emergency hotline at 
                  <a href="tel:1-800-TAPSTEAD" className="text-red-600 font-bold mx-1">1-800-TAPSTEAD</a>
                  in addition to booking online. Our emergency response team is available 24/7.
                </p>
                <p className="text-gray-700">
                  Average response time: <span className="font-semibold">1-3 hours</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
