"use server"

import { z } from "zod"

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get("email") as string

    const validatedData = newsletterSchema.parse({ email })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Here you would typically:
    // 1. Add email to your newsletter service (Mailchimp, ConvertKit, etc.)
    // 2. Store in database
    // 3. Send welcome email

    console.log("Newsletter subscription for:", validatedData.email)

    return {
      success: true,
      message: "Successfully subscribed to newsletter! Check your email for confirmation.",
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "Failed to subscribe. Please try again later.",
    }
  }
}

export async function getBlogPosts() {
  // This would typically fetch from your CMS or database
  return [
    {
      id: "1",
      title: "Essential Home Maintenance Tips for Winter",
      excerpt:
        "Prepare your home for winter with these essential maintenance tips that will save you money and prevent costly repairs.",
      content: "Full blog post content would go here...",
      author: "Sarah Johnson",
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      category: "Home Maintenance",
      tags: ["winter", "maintenance", "tips"],
      featured: true,
    },
    {
      id: "2",
      title: "How to Choose the Right Contractor for Your Project",
      excerpt:
        "Learn what to look for when hiring a contractor and how to avoid common pitfalls in the selection process.",
      content: "Full blog post content would go here...",
      author: "Mike Davis",
      publishedAt: "2024-01-10",
      readTime: "7 min read",
      category: "Contractor Tips",
      tags: ["contractors", "hiring", "projects"],
      featured: false,
    },
  ]
}
