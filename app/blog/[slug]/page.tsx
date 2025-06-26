import { notFound } from "next/navigation"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { BlogPostPage } from "@/components/pages/blog-post"
import { blogPosts, featuredPost } from "@/lib/blog-data"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = [featuredPost, ...blogPosts].find(
    (post) => createSlug(post.title) === slug
  )

  if (!post) {
    return {
      title: "Blog Post Not Found - Tapstead",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} - Tapstead Blog`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const posts = [featuredPost, ...blogPosts]
  
  return posts.map((post) => ({
    slug: createSlug(post.title),
  }))
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = [featuredPost, ...blogPosts].find(
    (post) => createSlug(post.title) === slug
  )

  if (!post) {
    notFound()
  }

  return (
    <MarketingLayout>
      <BlogPostPage post={post} />
    </MarketingLayout>
  )
}
