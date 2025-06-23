import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, Search, TrendingUp, Home, Wrench, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { blogPosts, featuredPost } from "@/lib/blog-data"

// Only show a subset of blog posts initially for better performance
const initialPostsToShow = 6;

// Calculate category counts from blog posts
const getCategoryCounts = () => {
  const counts: Record<string, number> = { "All Posts": blogPosts.length + 1 } // +1 for featured post
  
  // Count categories from regular posts
  blogPosts.forEach(post => {
    if (post.category) {
      counts[post.category] = (counts[post.category] || 0) + 1
    }
  })
  
  // Add featured post category
  if (featuredPost.category) {
    counts[featuredPost.category] = (counts[featuredPost.category] || 0) + 1
  }
  
  return counts
}

const categoryCounts = getCategoryCounts()

const categories = [
  { name: "All Posts", count: categoryCounts["All Posts"] || 0, icon: Home },
  { name: "Maintenance", count: categoryCounts["Maintenance"] || 0, icon: Wrench },
  { name: "Plumbing", count: categoryCounts["Plumbing"] || 0, icon: Wrench },
  { name: "Electrical", count: categoryCounts["Electrical"] || 0, icon: Zap },
  { name: "Emergency", count: categoryCounts["Emergency"] || 0, icon: TrendingUp },
  { name: "Technology", count: categoryCounts["Technology"] || 0, icon: Zap },
]

const popularPosts = [
  "10 Home Maintenance Tasks You Should Never Skip",
  "How to Prepare Your Home for Winter Weather",
  "The Cost of Delaying Home Repairs: What You Need to Know",
  "DIY vs Professional: When to Call the Experts",
]

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

export function BlogPage() {
  const [visiblePosts, setVisiblePosts] = React.useState(initialPostsToShow);
  const [activeCategory, setActiveCategory] = React.useState("All Posts");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter posts based on category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "All Posts" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Show featured post only if it matches the current filter
  const showFeatured = activeCategory === "All Posts" || featuredPost.category === activeCategory;
  const visiblePostsList = filteredPosts.slice(0, visiblePosts);

  const loadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  // Update category counts when posts change
  React.useEffect(() => {
    // This will recalculate category counts if needed
  }, [blogPosts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Home Service Insights</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Expert tips, guides, and insights to help you maintain, improve, and protect your home.
          </p>
          <div className="max-w-md mx-auto relative">
            <Input
              placeholder="Search articles..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 ${
                      activeCategory === category.name ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularPosts.map((post, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-gray-100 rounded-md w-12 h-12 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">{post}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Mar 15, 2024</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card>
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
                <CardDescription>
                  Get the latest home maintenance tips and exclusive offers straight to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input placeholder="Your email address" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {showFeatured && (
              <Card className="mb-12 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <Image
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      width={600}
                      height={400}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-6">
                    <Badge className="mb-3">{featuredPost.category}</Badge>
                    <h2 className="text-2xl font-bold mb-3">{featuredPost.title}</h2>
                    <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/blog/${createSlug(featuredPost.title)}`}>
                        Read Full Article
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/blog/${createSlug(post.title)}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {visiblePosts < filteredPosts.length && (
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={loadMore}
                >
                  Load More Articles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
