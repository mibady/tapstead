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
  ArrowRight,
  Star,
  Flame,
  PipetteIcon as Pipe,
  Waves,
} from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Home,
    title: "House Cleaning",
    description: "Deep cleaning, regular maintenance, move-in/out cleaning",
    price: "Starting at $99",
    popular: true,
    features: ["Eco-friendly products", "Insured professionals", "Satisfaction guarantee"],
  },
  {
    icon: Wrench,
    title: "Handyman Services",
    description: "Repairs, installations, furniture assembly, and more",
    price: "Starting at $75/hr",
    popular: false,
    features: ["Licensed professionals", "All tools included", "1-year warranty"],
  },
  {
    icon: Pipe,
    title: "Plumbing Services",
    description: "Leak repairs, drain cleaning, fixture installation, emergency plumbing",
    price: "Starting at $89/hr",
    popular: false,
    features: ["Licensed plumbers", "24/7 emergency service", "Parts warranty"],
  },
  {
    icon: Trash2,
    title: "Junk Removal",
    description: "Furniture, appliances, construction debris, estate cleanouts",
    price: "Starting at $149",
    popular: false,
    features: ["Same-day service", "Eco-friendly disposal", "No hidden fees"],
  },
  {
    icon: Droplets,
    title: "Pressure Washing",
    description: "Driveways, decks, siding, and exterior surfaces",
    price: "Starting at $199",
    popular: false,
    features: ["Professional equipment", "Eco-safe detergents", "Before/after photos"],
  },
  {
    icon: Waves,
    title: "Gutter Services",
    description: "Gutter cleaning, repairs, installation, and downspout maintenance",
    price: "Starting at $159",
    popular: false,
    features: ["Debris removal", "Leak repairs", "Gutter guards available"],
  },
  {
    icon: Zap,
    title: "Electrical Services",
    description: "Outlet installation, lighting, ceiling fans, smart home setup",
    price: "Starting at $125",
    popular: false,
    features: ["Licensed electricians", "Code compliant", "Safety guaranteed"],
  },
  {
    icon: Paintbrush,
    title: "Interior Painting",
    description: "Room painting, touch-ups, color consultation",
    price: "Starting at $299",
    popular: false,
    features: ["Premium paints", "Clean workspace", "Color matching"],
  },
  {
    icon: Flame,
    title: "Welding Services",
    description: "Metal fabrication, repairs, custom welding projects, structural work",
    price: "Starting at $95/hr",
    popular: false,
    features: ["Certified welders", "Mobile service available", "All welding types"],
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">All Your Home Needs, One Tap Away</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From quick fixes to major projects, our vetted professionals handle it all. Transparent pricing, quality
            guaranteed.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow duration-300">
              {service.popular && (
                <Badge className="absolute -top-2 left-4 bg-orange-500 hover:bg-orange-600">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <div className="text-sm font-semibold text-green-600">{service.price}</div>
                  </div>
                </div>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full" variant="gradient" asChild>
                  <Link href={`/book-now?service=${service.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Services CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
