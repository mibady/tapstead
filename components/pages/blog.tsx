"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, ArrowRight, Search, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { subscribeToNewsletter } from "@/lib/actions/blog-actions"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
  image: string
  featured: boolean
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching blog posts
    const fetchPosts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockPosts: BlogPost[] = [
        {
          id: "1",
          title: "10 Essential Home Maintenance Tips for Every Season",
          excerpt:
            "Keep your home in perfect condition year-round with these expert maintenance tips from professional service providers.",
          content:
            "Regular home maintenance is crucial for preserving your property's value and ensuring your family's comfort...",
          author: "Sarah Johnson",
          date: "2024-01-15",
          readTime: "5 min read",
          category: "Home Maintenance",
          tags: ["maintenance", "tips", "seasonal"],
          image: "/placeholder.svg?height=300&width=600&text=Home+Maintenance",
          featured: true,
        },
        {
          id: "2",
          title: "When to Call a Professional vs DIY: A Homeowner's Guide",
          excerpt:
            "Learn when it's safe to tackle home projects yourself and when you should call in the professionals.",
          content:
            "While DIY projects can be rewarding and cost-effective, some tasks require professional expertise...",
          author: "Mike Chen",
          date: "2024-01-10",
          readTime: "7 min read",
          category: "DIY vs Professional",
          tags: ["diy", "professional", "safety"],
          image: "/placeholder.svg?height=300&width=600&text=DIY+vs+Professional",
          featured: false,
        },
        {
          id: "3",
          title: "Spring Cleaning: Professional Services That Make a Difference",
          excerpt: "Discover which professional cleaning services can transform your home this spring season.",
          content: "Spring cleaning goes beyond just tidying up. Professional services can help you achieve...",
          author: "Emily Rodriguez",
          date: "2024-01-05",
          readTime: "4 min read",
          category: "Cleaning",
          tags: ["spring", "cleaning", "professional"],
          image: "/placeholder.svg?height=300&width=600&text=Spring+Cleaning",
          featured: false,
        },
      ]

      setPosts(mockPosts)
      setLoading(false)
    }

    fetchPosts()
  }, [])

  const categories = ["all", "Home Maintenance", "DIY vs Professional", "Cleaning", "Repairs", "Seasonal"]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = posts.find((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("email", newsletterEmail)
      const result = await subscribeToNewsletter(formData)
      setNewsletterStatus(result.message)
      setNewsletterEmail("")
    } catch (error) {
      setNewsletterStatus("Failed to subscribe. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tapstead Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert tips, guides, and insights for homeowners. Learn from professional service providers and keep your
              home in perfect condition.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <Badge className="bg-blue-600 text-white mb-4">Featured Article</Badge>
              <h2 className="text-3xl font-bold text-gray-900">Latest Insights</h2>
            </div>

            <Card className="max-w-4xl mx-auto overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    width={600}
                    height={300}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="mb-3">
                    {featuredPost.category}
                  </Badge>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>

                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button asChild>
                    <Link href={`/blog/${featuredPost.id}`}>
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Articles</h2>
            <p className="text-lg text-gray-600">Stay informed with our latest tips and insights</p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white">{post.category}</Badge>
                  </div>

                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </CardTitle>

                    <CardDescription className="text-gray-600">{post.excerpt}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${post.id}`}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the latest home maintenance tips and service insights delivered to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 text-gray-900"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </div>
            {newsletterStatus && <p className="mt-4 text-sm text-blue-100">{newsletterStatus}</p>}
          </form>
        </div>
      </section>
    </div>
  )
}

export default BlogPage
