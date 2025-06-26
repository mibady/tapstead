import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Wrench,
  Trash2,
  Droplets,
  Zap,
  Paintbrush,
  Star,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Flame,
  PipetteIcon as Pipe,
  Waves,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { getAllServices, getEmergencyServices } from "@/lib/services/service-data"

const regularServices = [
  {
    id: "house-cleaning",
    icon: Home,
    title: "House Cleaning",
    description: "Professional deep cleaning, regular maintenance, and move-in/out cleaning services",
    price: "Starting at $99",
    duration: "2-4 hours",
    popular: true,
    features: [
      "Eco-friendly cleaning products",
      "Background-checked professionals",
      "100% satisfaction guarantee",
      "Flexible scheduling",
      "All supplies included",
    ],
    benefits: [
      "Save 3-5 hours of your time",
      "Professional-grade equipment",
      "Consistent quality every time",
      "Bonded and insured team",
    ],
  },
  {
    id: "handyman",
    icon: Wrench,
    title: "Handyman Services",
    description: "Expert repairs, installations, furniture assembly, and general home maintenance",
    price: "Starting at $75/hr",
    duration: "1-3 hours",
    popular: false,
    features: [
      "Licensed professionals",
      "All tools and materials included",
      "1-year warranty on work",
      "Same-day availability",
      "Free estimates",
    ],
    benefits: ["No need to buy tools", "Professional expertise", "Time-saving solutions", "Quality workmanship"],
  },
  {
    id: "plumbing",
    icon: Pipe,
    title: "Plumbing Services",
    description: "Licensed plumbers for leak repairs, drain cleaning, fixture installation, and emergencies",
    price: "Starting at $89/hr",
    duration: "1-3 hours",
    popular: false,
    features: [
      "Licensed master plumbers",
      "24/7 emergency service",
      "Parts and labor warranty",
      "Upfront pricing",
      "Modern diagnostic tools",
    ],
    benefits: ["Prevent water damage", "Code-compliant work", "Emergency response", "Long-term solutions"],
  },
  {
    id: "gutter-services",
    icon: Waves,
    title: "Gutter Services",
    description: "Complete gutter cleaning, repairs, installation, and maintenance services",
    price: "Starting at $159",
    duration: "2-4 hours",
    popular: false,
    features: [
      "Debris removal and cleaning",
      "Leak detection and repair",
      "Gutter guard installation",
      "Downspout maintenance",
      "Safety equipment included",
    ],
    benefits: ["Protect home foundation", "Prevent water damage", "Extend roof lifespan", "Improve curb appeal"],
  },
  {
    id: "electrical",
    icon: Zap,
    title: "Electrical Services",
    description: "Licensed electricians for outlets, lighting, ceiling fans, and smart home installations",
    price: "Starting at $125",
    duration: "1-3 hours",
    popular: false,
    features: [
      "Licensed electricians",
      "Code-compliant installations",
      "Safety inspections included",
      "Smart home integration",
      "Emergency repairs",
    ],
    benefits: ["Enhanced home safety", "Increased property value", "Energy efficiency", "Modern convenience"],
  },
  {
    id: "pressure-washing",
    icon: Droplets,
    title: "Pressure Washing",
    description: "Professional cleaning for driveways, decks, siding, and exterior surfaces",
    price: "Starting at $199",
    duration: "2-4 hours",
    popular: false,
    features: [
      "Professional-grade equipment",
      "Eco-safe cleaning solutions",
      "Surface-appropriate pressure",
      "Before/after documentation",
      "Mold and mildew removal",
    ],
    benefits: [
      "Restore original appearance",
      "Increase curb appeal",
      "Prevent surface damage",
      "Healthier environment",
    ],
  },
  {
    id: "junk-removal",
    icon: Trash2,
    title: "Junk Removal",
    description: "Efficient removal of furniture, appliances, construction debris, and estate cleanouts",
    price: "Starting at $149",
    duration: "1-2 hours",
    popular: false,
    features: [
      "Same-day service available",
      "Eco-friendly disposal",
      "Heavy lifting included",
      "No hidden fees",
      "Donation coordination",
    ],
    benefits: ["Reclaim your space", "Stress-free removal", "Environmentally responsible", "No physical strain"],
  },
  {
    id: "painting",
    icon: Paintbrush,
    title: "Interior Painting",
    description: "Professional painting services including room painting, touch-ups, and color consultation",
    price: "Starting at $299",
    duration: "4-8 hours",
    popular: false,
    features: [
      "Premium paint brands",
      "Color consultation included",
      "Clean workspace guarantee",
      "Furniture protection",
      "Trim and detail work",
    ],
    benefits: ["Transform your space", "Professional finish", "Increase home value", "Stress-free experience"],
  },
  {
    id: "welding",
    icon: Flame,
    title: "Welding Services",
    description: "Certified welding for metal fabrication, repairs, and custom projects",
    price: "Starting at $95/hr",
    duration: "1-4 hours",
    popular: false,
    features: [
      "AWS certified welders",
      "Mobile welding service",
      "All welding types (MIG, TIG, Stick)",
      "Custom fabrication",
      "Structural repairs",
    ],
    benefits: ["Professional craftsmanship", "Durable solutions", "Custom metalwork", "On-site convenience"],
  },
]

const emergencyServices = [
  {
    id: "fire-debris-removal",
    icon: Flame,
    title: "Fire Debris Removal",
    description: "Emergency fire damage cleanup, ash removal, and hazardous material disposal",
    price: "Starting at $299",
    duration: "4-8 hours",
    features: [
      "24/7 emergency response",
      "Hazmat certified teams",
      "Insurance coordination",
      "Structural debris removal",
      "Complete site cleanup",
    ],
    responseTime: "2-4 hours",
  },
  {
    id: "storm-damage-cleanup",
    icon: AlertTriangle,
    title: "Storm Damage Cleanup",
    description: "Emergency cleanup after storms, hurricanes, and natural disasters",
    price: "Starting at $249",
    duration: "3-6 hours",
    features: [
      "Emergency tree removal",
      "Roof debris cleanup",
      "Water damage mitigation",
      "Insurance documentation",
      "Site stabilization",
    ],
    responseTime: "1-3 hours",
  },
]

// Map service categories to icons
const categoryIcons: Record<string, any> = {
  "cleaning": Home,
  "handyman": Wrench,
  "plumbing": Pipe,
  "electrical": Zap,
  "painting": Paintbrush,
  "pressure-washing": Droplets,
  "gutter": Waves,
  "junk-removal": Trash2,
  "welding": Flame,
  "emergency": AlertTriangle,
  "fire": Flame,
  "storm": AlertTriangle
}

// Helper function to get icon for a service
function getIconForService(category: string) {
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key)) {
      return icon;
    }
  }
  return Home; // Default icon
}

export async function ServicesOverview() {
  // Fetch services from the database
  const regularServices = await getAllServices();
  const emergencyServices = await getEmergencyServices();
  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Professional Home Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From routine maintenance to emergency repairs, our vetted professionals handle every aspect of home care.
            Transparent pricing, quality guaranteed, instant booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/book-now">Book a Service Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Regular Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Regular Home Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Keep your home in perfect condition with our comprehensive range of professional services
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {regularServices
              .filter(service => !service.category.toLowerCase().includes('emergency'))
              .map((service) => {
                const ServiceIcon = getIconForService(service.category);
                const serviceSlug = service.category.toLowerCase();
                const priceDisplay = `Starting at $${service.base_price.toFixed(2)}`;
                
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                    {service.category === 'cleaning' && (
                      <Badge className="absolute -top-2 left-4 bg-orange-500 hover:bg-orange-600">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}

                    <CardHeader>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <ServiceIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{service.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="font-semibold text-green-600">{priceDisplay}</span>
                            <div className="flex items-center text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-gray-600 text-lg">{service.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                        <ul className="space-y-2">
                          {[
                            "Professional equipment and supplies",
                            "Licensed and insured technicians",
                            "100% satisfaction guarantee",
                            "Flexible scheduling options",
                            "Transparent pricing"
                          ].map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                        <ul className="space-y-2">
                          {[
                            "Save time and effort",
                            "Professional quality results",
                            "Peace of mind with vetted pros",
                            "Consistent service quality"
                          ].map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-700">
                              <Shield className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex space-x-3">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href={`/book-now?service=${service.id}`}>
                            Book Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                        <Button variant="outline" className="flex-1" asChild>
                          <Link href={`/services/${serviceSlug}`}>Learn More</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900">Emergency Services</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              24/7 emergency response for disasters and urgent situations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {emergencyServices.map((service) => {
              const ServiceIcon = getIconForService(service.category);
              const serviceSlug = service.category.toLowerCase();
              const priceDisplay = `Starting at $${service.base_price.toFixed(2)}`;
              
              return (
                <Card key={service.id} className="border-red-200 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <ServiceIcon className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{service.title}</CardTitle>
                        <Badge className="bg-red-600 hover:bg-red-700 mt-2">Emergency Service</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 text-lg">{service.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center text-red-800">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="font-medium">Response Time: 1-3 hours</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Emergency Response Includes:</h4>
                      <ul className="space-y-2">
                        {[
                          "24/7 emergency response",
                          "Immediate damage assessment",
                          "Priority scheduling",
                          "Insurance documentation",
                          "Complete site cleanup"
                        ].map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-red-600 hover:bg-red-700" asChild>
                        <Link href={`/book-now?service=${service.id}&emergency=true`}>Emergency Call</Link>
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/services/${serviceSlug}`}>Learn More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Tapstead?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Shield className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="font-semibold text-lg">Fully Insured</h3>
              <p className="text-gray-600">All professionals are licensed, bonded, and insured up to $2M</p>
            </div>
            <div className="space-y-4">
              <Star className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="font-semibold text-lg">Quality Guaranteed</h3>
              <p className="text-gray-600">100% satisfaction guarantee or we'll make it right</p>
            </div>
            <div className="space-y-4">
              <Clock className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="font-semibold text-lg">On-Time Promise</h3>
              <p className="text-gray-600">We arrive when promised or your service is free</p>
            </div>
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="font-semibold text-lg">Transparent Pricing</h3>
              <p className="text-gray-600">Upfront pricing with no hidden fees or surprises</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
