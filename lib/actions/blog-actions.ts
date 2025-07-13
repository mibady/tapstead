"use server"

import { z } from "zod"

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

const commentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  comment: z.string().min(10, "Comment must be at least 10 characters long"),
  postId: z.string().min(1, "Post ID is required"),
})

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get("email") as string

    const validatedData = newsletterSchema.parse({ email })

    // Here you would typically save to database or send to email service
    // For now, we'll simulate a successful subscription
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Successfully subscribed to newsletter!",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "Failed to subscribe. Please try again.",
    }
  }
}

export async function submitComment(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const comment = formData.get("comment") as string
    const postId = formData.get("postId") as string

    const validatedData = commentSchema.parse({
      name,
      email,
      comment,
      postId,
    })

    // Here you would typically save to database
    // For now, we'll simulate a successful comment submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Comment submitted successfully!",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "Failed to submit comment. Please try again.",
    }
  }
}
