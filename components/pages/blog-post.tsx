import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BlogPost } from "@/types/blog"
import { sanitizeHTML, isSafeText } from "@/lib/utils/html-sanitizer"

interface BlogPostPageProps {
  post: BlogPost
}

export function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Post Header */}
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 relative rounded-lg overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content && (
              isSafeText(post.content) ? (
                // If content is safe plain text, render directly
                <div className="whitespace-pre-wrap">{post.content}</div>
              ) : (
                // If content contains HTML, sanitize it first
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} />
              )
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags?.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Share */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share This Article
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex items-center">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button size="sm" variant="outline" className="flex items-center">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button size="sm" variant="outline" className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button size="sm" variant="outline" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {post.relatedPosts?.slice(0, 2).map((relatedPost, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Image
                    src={relatedPost.image || "/placeholder.svg"}
                    alt={relatedPost.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {relatedPost.category}
                    </Badge>
                    <CardTitle className="text-lg leading-tight">{relatedPost.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/blog/${createSlug(relatedPost.title)}`}>Read More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle>About the Author</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <Image
                  src={`/placeholder.svg?text=${post.author.charAt(0)}`}
                  alt={post.author}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">{post.author}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Home service expert with over 10 years of experience in the industry.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View All Posts
              </Button>
            </CardContent>
          </Card>

          {/* Newsletter Signup */}
          <Card>
            <CardHeader>
              <CardTitle>Stay Updated</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Get the latest home service tips delivered to your inbox.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border rounded"
              />
              <Button className="w-full">Subscribe</Button>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3">Need Professional Help?</h3>
              <p className="mb-4 opacity-90">
                Our network of verified professionals is ready to assist with your home service needs.
              </p>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/book-now">Book a Service</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}
