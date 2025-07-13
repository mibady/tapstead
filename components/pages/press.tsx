"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, Mail, Calendar, Users, MapPin, Star, TrendingUp, Award, Newspaper } from "lucide-react"
import Image from "next/image"

export function PressPage() {
  const companyStats = [
    { label: "Founded", value: "2023", icon: Calendar },
    { label: "Headquarters", value: "Seattle, WA", icon: MapPin },
    { label: "Team Members", value: "12", icon: Users },
    { label: "Cities Served", value: "15+", icon: MapPin },
    { label: "Seed Funding", value: "$500K", icon: TrendingUp },
    { label: "Customer Rating", value: "4.9/5", icon: Star },
  ]

  const pressReleases = [
    {
      type: "Milestone",
      title: "Tapstead Reaches 2,500 Customers in First Year",
      description: "Regional home services startup celebrates rapid growth across Pacific Northwest markets.",
      date: "March 15, 2024",
      category: "Growth",
    },
    {
      type: "Product",
      title: "Tapstead Launches AI-Powered Customer Support",
      description: "24/7 virtual assistant helps customers book services and get instant support via phone and chat.",
      date: "February 8, 2024",
      category: "Technology",
    },
    {
      type: "Expansion",
      title: "Tapstead Expands to Tacoma and Bellevue Markets",
      description: "Growing demand drives expansion to serve South Sound and Eastside communities.",
      date: "January 22, 2024",
      category: "Expansion",
    },
    {
      type: "Funding",
      title: "Tapstead Secures $500K Seed Round",
      description: "Local investors back Pacific Northwest home services startup's transparent pricing model.",
      date: "December 10, 2023",
      category: "Funding",
    },
    {
      type: "Launch",
      title: "Tapstead Launches in Greater Seattle Area",
      description: "New platform brings transparent pricing and instant booking to home cleaning services.",
      date: "October 15, 2023",
      category: "Launch",
    },
  ]

  const mediaCoverage = [
    {
      title: "Seattle Startup Aims to Simplify Home Services",
      publication: "The Seattle Times",
      section: "Business Section",
      date: "March 20, 2024",
    },
    {
      title: "Young Entrepreneurs Tackle Home Services Pain Points",
      publication: "Puget Sound Business Journal",
      section: "Startup Spotlight",
      date: "February 28, 2024",
    },
    {
      title: "Tech Meets Home Services: Local Company's Fresh Approach",
      publication: "GeekWire",
      section: "Startup News",
      date: "January 15, 2024",
    },
    {
      title: "Rising Stars: Pacific Northwest Startups to Watch",
      publication: "Seattle Met Magazine",
      section: "Business Feature",
      date: "December 2023",
    },
  ]

  const awards = [
    {
      title: "Best New Business 2024",
      organization: "Seattle Chamber of Commerce",
      description: "Nominated for innovation in home services sector",
      date: "March 2024",
    },
    {
      title: "Top Startup to Watch",
      organization: "Washington Technology Industry Association",
      description: "Featured in annual emerging companies report",
      date: "February 2024",
    },
    {
      title: "Customer Choice Award",
      organization: "Angie's List",
      description: "4.9/5 rating from verified customers",
      date: "January 2024",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Press & Media</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Latest news and company updates about Tapstead's mission to bring reliable home services to the Pacific
            Northwest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download Media Kit
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:press@tapstead.com">
                <Mail className="w-4 h-4 mr-2" />
                Contact Press Team
              </a>
            </Button>
          </div>
        </div>

        {/* Company Stats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Company at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {companyStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Company News</h2>
            <p className="text-lg text-gray-600">Stay updated with our latest announcements and milestones</p>
          </div>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline">{release.type}</Badge>
                        <span className="text-sm text-gray-500">{release.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                      <p className="text-gray-600 mb-4">{release.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Media Coverage */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">In the News</h2>
            <p className="text-lg text-gray-600">Media coverage and industry recognition</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaCoverage.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Newspaper className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-blue-600 font-medium">{article.publication}</p>
                      <p className="text-sm text-gray-500">
                        {article.section} • {article.date}
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2">
                        Read Article →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recognition</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{award.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{award.organization}</p>
                  <p className="text-sm text-gray-600 mb-2">{award.description}</p>
                  <p className="text-xs text-gray-500">{award.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Founder Quotes */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">From Our Founders</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Image
                    src="/placeholder.svg?height=80&width=80&text=MB"
                    alt="Michael Bady"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <blockquote className="text-lg text-gray-700 italic mb-4">
                      "We started Tapstead because finding reliable home services shouldn't require guesswork. Every
                      homeowner deserves transparent pricing and quality service they can trust."
                    </blockquote>
                    <div>
                      <div className="font-semibold text-gray-900">Michael Bady</div>
                      <div className="text-sm text-gray-600">Founder & CEO</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Image
                    src="/placeholder.svg?height=80&width=80&text=NB"
                    alt="Natasha Blake"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <blockquote className="text-lg text-gray-700 italic mb-4">
                      "Our focus on the Pacific Northwest allows us to build deep relationships with both customers and
                      service professionals. We're not trying to be everything to everyone - we're focused on being the
                      best in our region."
                    </blockquote>
                    <div>
                      <div className="font-semibold text-gray-900">Natasha Blake</div>
                      <div className="text-sm text-gray-600">Co-Founder & COO</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Press Contact */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Press Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Media Contact</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Email:</strong> press@tapstead.com
                    </p>
                    <p>
                      <strong>Phone:</strong> (360) 641-7386
                    </p>
                    <p>
                      <strong>Response Time:</strong> Within 24 hours
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Available for Interviews</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Michael Bady, Founder & CEO</li>
                    <li>• Natasha Blake, Co-Founder & COO</li>
                    <li>• Candace Perelli, Head of Operations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Newsletter Signup */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Stay Updated</CardTitle>
              <CardDescription className="text-center">
                Get company news and press releases delivered to your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <Input type="email" placeholder="Enter your email address" className="flex-1" />
                  <Button type="submit">Subscribe</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default PressPage
