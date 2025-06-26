import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, ExternalLink } from "lucide-react"
import Image from "next/image"

const pressReleases = [
  {
    date: "2024-01-15",
    title: "Tapstead Raises $50M Series B to Expand Home Services Platform",
    excerpt: "Funding will accelerate expansion into new markets and enhance AI-powered matching technology.",
    category: "Funding",
    featured: true,
  },
  {
    date: "2023-12-08",
    title: "Tapstead Launches Emergency Services Division",
    excerpt: "New 24/7 emergency response capabilities for disaster cleanup and urgent home repairs.",
    category: "Product",
  },
  {
    date: "2023-11-22",
    title: "Tapstead Reaches 500,000 Customers Milestone",
    excerpt: "Platform growth accelerates with 200% year-over-year increase in bookings.",
    category: "Milestone",
  },
  {
    date: "2023-10-10",
    title: "Tapstead Partners with Major Insurance Companies",
    excerpt: "Strategic partnerships enable seamless insurance claim processing for home repairs.",
    category: "Partnership",
  },
  {
    date: "2023-09-15",
    title: "Tapstead Wins 'Best Home Services App' Award",
    excerpt: "Recognition from Home Services Industry Association for innovation and customer satisfaction.",
    category: "Award",
  },
]

const mediaKit = [
  {
    title: "Company Logos",
    description: "High-resolution logos in various formats",
    type: "ZIP",
    size: "2.4 MB",
  },
  {
    title: "Executive Photos",
    description: "Professional headshots of leadership team",
    type: "ZIP",
    size: "8.1 MB",
  },
  {
    title: "Product Screenshots",
    description: "App and platform interface images",
    type: "ZIP",
    size: "12.3 MB",
  },
  {
    title: "Company Fact Sheet",
    description: "Key statistics and company information",
    type: "PDF",
    size: "1.2 MB",
  },
]

const mediaFeatures = [
  {
    outlet: "TechCrunch",
    title: "How Tapstead is Disrupting the $400B Home Services Market",
    date: "2024-01-20",
    type: "Feature Article",
    logo: "/placeholder.svg?height=40&width=120&text=TechCrunch",
  },
  {
    outlet: "Forbes",
    title: "The Future of Home Services: An Interview with Tapstead's CEO",
    date: "2023-12-15",
    type: "Interview",
    logo: "/placeholder.svg?height=40&width=120&text=Forbes",
  },
  {
    outlet: "Wall Street Journal",
    title: "On-Demand Home Services See Surge in Post-Pandemic Era",
    date: "2023-11-30",
    type: "Market Analysis",
    logo: "/placeholder.svg?height=40&width=120&text=WSJ",
  },
  {
    outlet: "Fast Company",
    title: "Most Innovative Companies 2023: Tapstead",
    date: "2023-10-25",
    type: "Recognition",
    logo: "/placeholder.svg?height=40&width=120&text=Fast+Company",
  },
]

const companyStats = [
  { label: "Founded", value: "2020" },
  { label: "Headquarters", value: "San Francisco, CA" },
  { label: "Employees", value: "500+" },
  { label: "Cities Served", value: "50+" },
  { label: "Total Funding", value: "$75M" },
  { label: "Customer Rating", value: "4.9/5" },
]

export function PressPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Press & Media</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Latest news, announcements, and media coverage about Tapstead's mission to revolutionize home services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Download Media Kit
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Contact Press Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {companyStats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Press Releases</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with our latest announcements and company news
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {pressReleases.map((release, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow ${release.featured ? "border-blue-500 border-2" : ""}`}
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={release.featured ? "default" : "secondary"}>{release.category}</Badge>
                        {release.featured && (
                          <Badge variant="outline" className="border-blue-500 text-blue-600">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                      <CardDescription className="text-base">{release.excerpt}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(release.date).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm">
                        Read More
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Media Coverage</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what leading publications are saying about Tapstead
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {mediaFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={feature.logo || "/placeholder.svg"}
                        alt={feature.outlet}
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                      />
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline">{feature.type}</Badge>
                          <span className="text-sm text-gray-600">{feature.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Read Article
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Media Kit</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Download our media assets and company information</p>
          </div>
          <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {item.title}
                    <Download className="w-5 h-5 text-gray-400" />
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {item.type} • {item.size}
                    </div>
                    <Button size="sm">Download</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Media Inquiries</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            For press inquiries, interview requests, or additional information, please contact our media relations team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              press@tapstead.com
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              (555) 123-PRESS
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
