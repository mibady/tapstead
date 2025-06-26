import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Heart, Shield, Users, Award, TrendingUp, MapPin, Star, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "We believe in honest, upfront pricing and clear communication. No hidden fees, no surprises - just transparent service you can count on.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every decision we make starts with our customers. We're not satisfied until you're completely happy with your service experience.",
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description:
      "We maintain the highest standards for our professionals and services. Quality isn't just a goal - it's our promise to you.",
  },
  {
    icon: Users,
    title: "Community Impact",
    description:
      "We're committed to supporting local professionals and giving back to the communities we serve through job creation and local partnerships.",
  },
]

const milestones = [
  {
    year: "2020",
    title: "Founded",
    description: "Tapstead was founded with a simple mission: make home services as easy as tapping a button.",
  },
  {
    year: "2021",
    title: "First 1,000 Customers",
    description: "Reached our first milestone of 1,000 satisfied customers across 5 cities.",
  },
  {
    year: "2022",
    title: "50 Cities",
    description: "Expanded to 50 cities nationwide with over 500 vetted professionals on our platform.",
  },
  {
    year: "2023",
    title: "10,000 Jobs Completed",
    description: "Celebrated 10,000 successfully completed jobs with a 4.9/5 average rating.",
  },
  {
    year: "2024",
    title: "Emergency Services",
    description: "Launched 24/7 emergency services including fire debris removal and disaster cleanup.",
  },
]

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    bio: "Former operations director at a major home services company. Passionate about using technology to solve real-world problems.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    bio: "Software engineer with 15+ years experience building scalable platforms. Believes technology should make life simpler.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Operations",
    bio: "Expert in service delivery and quality assurance. Ensures every customer receives exceptional service.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "David Kim",
    role: "Head of Customer Success",
    bio: "Customer experience specialist focused on building lasting relationships and ensuring satisfaction.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

const stats = [
  { number: "50,000+", label: "Jobs Completed", icon: CheckCircle },
  { number: "10,000+", label: "Happy Customers", icon: Users },
  { number: "500+", label: "Vetted Professionals", icon: Award },
  { number: "50+", label: "Cities Served", icon: MapPin },
  { number: "4.9/5", label: "Average Rating", icon: Star },
  { number: "24/7", label: "Customer Support", icon: Shield },
]

export function AboutUs() {
  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                  Simplifying Home Services,
                  <br />
                  <span className="text-blue-600">One Tap at a Time</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We believe maintaining your home shouldn't be complicated, time-consuming, or stressful. That's why we
                  created Tapstead - to make professional home services as simple as tapping a button.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/book-now">Experience Tapstead</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/careers">Join Our Team</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/hero-illustration.png"
                alt="Tapstead team working"
                width={600}
                height={500}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-blue-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To revolutionize the home services industry by creating a platform that connects homeowners with
                  trusted professionals through transparent pricing, reliable service, and exceptional customer
                  experience. We're building the future where home maintenance is effortless.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  A world where every homeowner has instant access to reliable, professional home services. Where
                  maintaining your home is as easy as ordering food or calling a ride. Where quality, trust, and
                  convenience are the standard, not the exception.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do, from how we select professionals to how we serve our customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                      <value.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tapstead by the Numbers</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our growth reflects the trust our customers place in us every day
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="w-8 h-8 text-blue-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a simple idea to serving thousands of customers across the country
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-blue-600">{milestone.year}</Badge>
                        <h3 className="font-semibold text-xl text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate people behind Tapstead who are dedicated to revolutionizing home services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Tapstead Community</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Whether you're a homeowner looking for reliable services or a professional wanting to grow your business,
            we'd love to have you join our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/book-now">
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/careers">Join Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
