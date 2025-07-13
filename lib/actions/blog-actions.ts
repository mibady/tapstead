"use server"

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    throw new Error("Email is required")
  }

  // Simulate newsletter subscription
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would save to database or call an API
  console.log("Newsletter subscription:", email)

  return { success: true, message: "Successfully subscribed to newsletter!" }
}

export async function submitComment(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const comment = formData.get("comment") as string

  if (!name || !email || !comment) {
    throw new Error("All fields are required")
  }

  // Simulate comment submission
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would save to database
  console.log("Comment submission:", { name, email, comment })

  return { success: true, message: "Comment submitted successfully!" }
}
