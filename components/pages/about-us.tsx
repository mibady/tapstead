import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Award, Clock, Shield, ArrowRight, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AboutUsPage() {
  const stats = [
    { number: "2,500+", label: "Happy Customers" },
    { number: "15+", label: "Cities Served" },
    { number: "50+", label: "Vetted Professionals" },
    { number: "4.9/5", label: "Average Rating" },
  ]

  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "All professionals are background checked, licensed, and insured for your peace of mind.",
    },
    {
      icon: Clock,
      title: "Reliability",
      description: "We show up on time, every time. Your schedule matters to us.",
    },
    {
      icon: Award,
      title: "Quality Service",
      description: "We maintain the highest standards and guarantee satisfaction with every service.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your needs come first. We're here to make your life easier and your home better.",
    },
  ]

  const team = [
    {
      name: "Michael Bady",
      role: "Founder",
      image: "/placeholder-user.jpg",
      bio: "Passionate entrepreneur with a vision to revolutionize home services through technology and exceptional customer experience.",
    },
    {
      name: "Natasha Blake",
      role: "Co-Founder",
      image: "/placeholder-user.jpg",
      bio: "Operations expert focused on building scalable systems and ensuring quality service delivery across all markets.",
    },
    {
      name: "Candace Perelli",
      role: "Head of Operations",
      image: "/placeholder-user.jpg",
      bio: "Expert in service delivery and quality assurance, ensuring every customer receives exceptional service.",
    },
    {
      name: "Celeste Wittingham",
      role: "Head of Customer Success",
      image: "/placeholder-user.jpg",
      bio: "Customer experience specialist focused on building lasting relationships and ensuring customer satisfaction.",
    },
  ]

  const timeline = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Tapstead was founded with a mission to simplify home services in the Pacific Northwest.",
    },
    {
      year: "2024",
      title: "Service Launch",
      description: "Launched house cleaning services with transparent pricing and instant booking.",
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Expanded to 15+ cities and added handyman, plumbing, and electrical services.",
    },
    {
      year: "2024",
      title: "2,500+ Customers",
      description: "Reached milestone of serving over 2,500 satisfied customers across the region.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">About Tapstead</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Making Home Services
              <span className="text-blue-600 block">Simple & Reliable</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're on a mission to transform how homeowners connect with trusted service professionals. Transparent
              pricing, instant booking, and quality you can count on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/book-now" className="flex items-center">
                  Book a Service
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link href="/contact" className="flex items-center">
                  Contact Us
                  <Phone className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Founded in 2023, Tapstead was born from a simple frustration: finding reliable home services shouldn't
                be complicated, expensive, or stressful.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">The Problem We Solve</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Hidden Pricing</h4>
                      <p className="text-gray-600">No more surprise costs or unclear estimates</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Unreliable Service</h4>
                      <p className="text-gray-600">All professionals are vetted and background checked</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Complicated Booking</h4>
                      <p className="text-gray-600">Book instantly online with just a few taps</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Image
                  src="/images/hero-homeowner.png"
                  alt="Happy homeowner"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <value.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                The passionate people behind Tapstead who are dedicated to revolutionizing home services
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
              <p className="text-xl text-gray-600">Key milestones in our mission to transform home services</p>
            </div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {item.year.slice(-2)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust Tapstead for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/book-now" className="flex items-center">
                Book Your Service
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/contact" className="flex items-center">
                <Phone className="mr-2 w-4 h-4" />
                (360) 641-7386
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
