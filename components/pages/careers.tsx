import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, TrendingUp, Heart, Shield, Zap } from "lucide-react"

const jobOpenings = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote / San Francisco",
    type: "Full-time",
    description: "Build scalable systems that power millions of home service bookings.",
    requirements: ["5+ years React/Node.js", "Experience with real-time systems", "Database optimization"],
  },
  {
    title: "Product Manager - Mobile",
    department: "Product",
    location: "San Francisco",
    type: "Full-time",
    description: "Lead our mobile product strategy and drive user engagement.",
    requirements: ["3+ years product management", "Mobile app experience", "Data-driven mindset"],
  },
  {
    title: "Operations Manager",
    department: "Operations",
    location: "Multiple Cities",
    type: "Full-time",
    description: "Scale our service provider network and ensure quality delivery.",
    requirements: ["Operations experience", "Team leadership", "Process optimization"],
  },
  {
    title: "Customer Success Specialist",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    description: "Ensure exceptional customer experiences and drive retention.",
    requirements: ["Customer service experience", "Problem-solving skills", "Communication excellence"],
  },
  {
    title: "Marketing Data Analyst",
    department: "Marketing",
    location: "Remote / New York",
    type: "Full-time",
    description: "Drive growth through data insights and marketing optimization.",
    requirements: ["SQL/Python skills", "Marketing analytics", "A/B testing experience"],
  },
  {
    title: "Service Provider Success Manager",
    department: "Provider Relations",
    location: "Chicago",
    type: "Full-time",
    description: "Support and grow our network of professional service providers.",
    requirements: ["Relationship management", "Training experience", "Home services knowledge"],
  },
]

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance plus wellness stipend",
  },
  {
    icon: TrendingUp,
    title: "Growth & Learning",
    description: "Professional development budget and mentorship programs",
  },
  {
    icon: Clock,
    title: "Work-Life Balance",
    description: "Flexible hours, unlimited PTO, and remote work options",
  },
  {
    icon: Users,
    title: "Equity & Ownership",
    description: "Competitive equity package so you share in our success",
  },
  {
    icon: Shield,
    title: "Financial Security",
    description: "401(k) matching, life insurance, and disability coverage",
  },
  {
    icon: Zap,
    title: "Perks & More",
    description: "Free home services, team events, and modern office spaces",
  },
]

const values = [
  {
    title: "Customer Obsession",
    description: "We start with the customer and work backwards, always putting their needs first.",
  },
  {
    title: "Quality Excellence",
    description: "We maintain the highest standards in everything we do, from code to customer service.",
  },
  {
    title: "Innovation Drive",
    description: "We embrace new ideas and technologies to solve complex problems.",
  },
  {
    title: "Team Collaboration",
    description: "We believe diverse perspectives and teamwork create the best outcomes.",
  },
]

export function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join the Future of
            <span className="block text-yellow-400">Home Services</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Help us revolutionize how people get things done at home. Build technology that matters. Create experiences
            that delight millions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Service Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$100M+</div>
              <div className="text-gray-600">Services Booked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape our culture
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Work at Tapstead?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We invest in our people because they're our greatest asset
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find your next opportunity and help us build the future
            </p>
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            {jobOpenings.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-base mt-2">{job.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="secondary">{job.department}</Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full md:w-auto">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't See Your Role?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            We're always looking for exceptional talent. Send us your resume and tell us how you'd like to contribute.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Send Us Your Resume
          </Button>
        </div>
      </section>
    </div>
  )
}
