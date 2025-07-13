"use client"

import { Pump } from "basehub/react-pump"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, User, Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tapstead Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tips, guides, and insights for homeowners and service professionals
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input type="text" placeholder="Search articles..." className="pl-10 pr-4 py-2 w-full" />
          </div>
        </div>

        {/* BaseHub CMS Integration */}
        <Pump
          queries={[
            {
              blog: {
                posts: {
                  items: {
                    _title: true,
                    _slug: true,
                    excerpt: true,
                    publishedAt: true,
                    featuredImage: {
                      url: true,
                      alt: true,
                    },
                    author: {
                      _title: true,
                      avatar: {
                        url: true,
                      },
                    },
                    categories: {
                      items: {
                        _title: true,
                        _slug: true,
                      },
                    },
                  },
                },
                featuredPosts: {
                  items: {
                    _title: true,
                    _slug: true,
                    excerpt: true,
                    publishedAt: true,
                    featuredImage: {
                      url: true,
                      alt: true,
                    },
                    author: {
                      _title: true,
                    },
                  },
                },
              },
            },
          ]}
        >
          {async ([data]) => {
            "use server"

            // Fallback data if BaseHub is not configured
            const fallbackPosts = [
              {
                _title: "10 Essential Home Maintenance Tips for Every Season",
                _slug: "home-maintenance-tips-every-season",
                excerpt:
                  "Keep your home in top condition year-round with these expert maintenance tips that will save you money and prevent costly repairs.",
                publishedAt: "2024-01-15",
                featuredImage: {
                  url: "/placeholder.svg?height=400&width=600&text=Home+Maintenance",
                  alt: "Home maintenance tools",
                },
                author: { _title: "Sarah Johnson" },
                categories: { items: [{ _title: "Home Care", _slug: "home-care" }] },
              },
              {
                _title: "How to Choose the Right Cleaning Service for Your Home",
                _slug: "choose-right-cleaning-service",
                excerpt:
                  "A comprehensive guide to selecting a professional cleaning service that meets your needs and budget.",
                publishedAt: "2024-01-10",
                featuredImage: {
                  url: "/placeholder.svg?height=400&width=600&text=Cleaning+Service",
                  alt: "Professional cleaning",
                },
                author: { _title: "Mike Chen" },
                categories: { items: [{ _title: "Cleaning", _slug: "cleaning" }] },
              },
              {
                _title: "Emergency Home Repairs: What to Do Before Help Arrives",
                _slug: "emergency-home-repairs-guide",
                excerpt:
                  "Learn how to handle common home emergencies safely while waiting for professional help to arrive.",
                publishedAt: "2024-01-05",
                featuredImage: {
                  url: "/placeholder.svg?height=400&width=600&text=Emergency+Repairs",
                  alt: "Emergency home repair",
                },
                author: { _title: "David Rodriguez" },
                categories: { items: [{ _title: "Emergency", _slug: "emergency" }] },
              },
              {
                _title: "Spring Cleaning Checklist: Room by Room Guide",
                _slug: "spring-cleaning-checklist-guide",
                excerpt:
                  "Get your home sparkling clean this spring with our comprehensive room-by-room cleaning checklist.",
                publishedAt: "2024-01-01",
                featuredImage: {
                  url: "/placeholder.svg?height=400&width=600&text=Spring+Cleaning",
                  alt: "Spring cleaning supplies",
                },
                author: { _title: "Lisa Thompson" },
                categories: { items: [{ _title: "Cleaning", _slug: "cleaning" }] },
              },
            ]

            const posts = data?.blog?.posts?.items || fallbackPosts
            const featuredPosts = data?.blog?.featuredPosts?.items || fallbackPosts.slice(0, 2)

            return (
              <>
                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                  <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {featuredPosts.map((post, index) => (
                        <Card key={post._slug || index} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            <Image
                              src={
                                post.featuredImage?.url || "/placeholder.svg?height=400&width=600&text=Featured+Post"
                              }
                              alt={post.featuredImage?.alt || post._title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="secondary" className="bg-blue-600 text-white">
                                Featured
                              </Badge>
                            </div>
                          </div>
                          <CardHeader>
                            <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                              <Link href={`/blog/${post._slug}`}>{post._title}</Link>
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author?._title || "Tapstead Team"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.publishedAt || Date.now()).toLocaleDateString()}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                            <Button variant="outline" asChild>
                              <Link href={`/blog/${post._slug}`}>
                                Read More <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* All Posts */}
                <section>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                      <Card key={post._slug || index} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                          <Image
                            src={post.featuredImage?.url || "/placeholder.svg?height=400&width=600&text=Blog+Post"}
                            alt={post.featuredImage?.alt || post._title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.categories?.items?.map((category, catIndex) => (
                              <Badge key={category._slug || catIndex} variant="outline">
                                {category._title}
                              </Badge>
                            ))}
                          </div>
                          <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                            <Link href={`/blog/${post._slug}`}>{post._title}</Link>
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author?._title || "Tapstead Team"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.publishedAt || Date.now()).toLocaleDateString()}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/blog/${post._slug}`}>
                              Read More <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Newsletter Signup */}
                <section className="mt-16 bg-white rounded-lg p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
                  <p className="text-gray-600 mb-6">
                    Get the latest home care tips and Tapstead updates delivered to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input type="email" placeholder="Enter your email" className="flex-1" />
                    <Button>Subscribe</Button>
                  </div>
                </section>
              </>
            )
          }}
        </Pump>
      </div>
    </div>
  )
}

export default BlogPage
