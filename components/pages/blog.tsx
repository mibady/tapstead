import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, Search, TrendingUp, Home, Wrench, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredPost = {
  title: "The Complete Guide to Spring Home Maintenance",
  excerpt:
    "Get your home ready for spring with this comprehensive checklist covering everything from HVAC to landscaping.",
  author: "Sarah Johnson",
  date: "2024-03-15",
  readTime: "8 min read",
  category: "Maintenance",
  image: "/placeholder.svg?height=400&width=600&text=Spring+Maintenance+Guide",
  featured: true,
}

const blogPosts = [
  {
    title: "How to Choose the Right Plumber for Your Home",
    excerpt: "Essential tips for finding qualified, trustworthy plumbing professionals.",
    author: "Mike Chen",
    date: "2024-03-10",
    readTime: "5 min read",
    category: "Plumbing",
    image: "/placeholder.svg?height=200&width=300&text=Plumbing+Tips",
  },
  {
    title: "Emergency Preparedness: What Every Homeowner Should Know",
    excerpt: "Be ready for unexpected disasters with this emergency preparedness guide.",
    author: "Lisa Rodriguez",
    date: "2024-03-08",
    readTime: "7 min read",
    category: "Emergency",
    image: "/placeholder.svg?height=200&width=300&text=Emergency+Prep",
  },
  {
    title: "5 Signs Your Electrical System Needs Professional Attention",
    excerpt: "Don't ignore these warning signs that could indicate serious electrical issues.",
    author: "David Park",
    date: "2024-03-05",
    readTime: "4 min read",
    category: "Electrical",
    image: "/placeholder.svg?height=200&width=300&text=Electrical+Safety",
  },
  {
    title: "Maximizing Your Home's Curb Appeal on a Budget",
    excerpt: "Simple, cost-effective ways to improve your home's exterior appearance.",
    author: "Jennifer Adams",
    date: "2024-03-01",
    readTime: "6 min read",
    category: "Landscaping",
    image: "/placeholder.svg?height=200&width=300&text=Curb+Appeal",
  },
  {
    title: "The Ultimate Guide to Gutter Maintenance",
    excerpt: "Keep your gutters flowing freely with these maintenance tips and tricks.",
    author: "Tom Wilson",
    date: "2024-02-28",
    readTime: "5 min read",
    category: "Maintenance",
    image: "/placeholder.svg?height=200&width=300&text=Gutter+Guide",
  },
  {
    title: "Smart Home Technology: What's Worth the Investment?",
    excerpt: "A breakdown of smart home upgrades that actually add value to your property.",
    author: "Alex Kim",
    date: "2024-02-25",
    readTime: "8 min read",
    category: "Technology",
    image: "/placeholder.svg?height=200&width=300&text=Smart+Home",
  },
]

const categories = [
  { name: "All Posts", count: 24, icon: Home },
  { name: "Maintenance", count: 8, icon: Wrench },
  { name: "Plumbing", count: 5, icon: Wrench },
  { name: "Electrical", count: 4, icon: Zap },
  { name: "Emergency", count: 3, icon: TrendingUp },
  { name: "Technology", count: 4, icon: Zap },
]

const popularPosts = [
  "10 Home Maintenance Tasks You Should Never Skip",
  "How to Prepare Your Home for Winter Weather",
  "The Cost of Delaying Home Repairs: What You Need to Know",
  "DIY vs Professional: When to Call the Experts",
]

export function BlogPage() {
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
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
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
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Button>Read Full Article</Button>
                </div>
              </div>
            </Card>

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
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/blog/category/${category.name.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <category.icon className="w-4 h-4 mr-2 text-gray-500" />
                      {category.name}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularPosts.map((post, index) => (
                  <Link key={index} href="#" className="block p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-medium leading-tight">{post}</div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
                <CardDescription>Get the latest home service tips delivered to your inbox.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Enter your email" />
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
