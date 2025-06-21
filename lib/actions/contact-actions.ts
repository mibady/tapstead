"use server"

import { createServerClient } from "@/lib/supabase/client"
import { sendContactFormNotification, sendQuoteRequestNotification } from "@/lib/services/resend-service"

export async function submitContactForm(formData: FormData) {
  const supabase = createServerClient()

  const contactData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    service: formData.get("service") as string,
    message: formData.get("message") as string,
    created_at: new Date().toISOString(),
  }

  // Validate required fields
  if (!contactData.name || !contactData.email || !contactData.message) {
    throw new Error("Please fill in all required fields")
  }

  try {
    // Save to database
    const { error } = await supabase.from("contact_submissions").insert(contactData)
    if (error) throw error

    // Send notification email using Resend
    await sendContactFormNotification(contactData)

    return { success: true, message: "Thank you for your message. We'll get back to you soon!" }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    throw new Error("Failed to submit contact form")
  }
}

export async function requestQuote(formData: FormData) {
  const supabase = createServerClient()

  const quoteData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    service: formData.get("service") as string,
    property_type: formData.get("property_type") as string,
    property_size: formData.get("property_size") as string,
    urgency: formData.get("urgency") as string,
    description: formData.get("description") as string,
    created_at: new Date().toISOString(),
  }

  try {
    // Save to database
    const { error } = await supabase.from("quote_requests").insert(quoteData)
    if (error) throw error

    // Send notification email using Resend
    await sendQuoteRequestNotification(quoteData)

    return { success: true, message: "Quote request submitted! We'll contact you within 24 hours." }
  } catch (error) {
    console.error("Error submitting quote request:", error)
    throw new Error("Failed to submit quote request")
  }
}
