"use server"

import { createServerClient } from "@/lib/supabase/client"
import { sendContactFormNotification, sendQuoteRequestNotification } from "@/lib/services/resend-service"
import { ContactFormSchema, QuoteRequestSchema, sanitizeInput } from "@/lib/validations/contact-validations"
import { z } from "zod"

export async function submitContactForm(formData: FormData) {
  const supabase = createServerClient()

  try {
    // Extract and sanitize form data
    const rawData = {
      name: sanitizeInput(formData.get("name") as string),
      email: sanitizeInput(formData.get("email") as string),
      phone: sanitizeInput(formData.get("phone") as string || ""),
      service: sanitizeInput(formData.get("service") as string || ""),
      message: sanitizeInput(formData.get("message") as string),
    }

    // Validate data using Zod schema
    const validatedData = ContactFormSchema.parse(rawData)

    const contactData = {
      ...validatedData,
      created_at: new Date().toISOString(),
      status: "new" as const,
    }

    // Save to database
    const { error } = await supabase.from("contact_submissions").insert(contactData)
    if (error) throw error

    // Send notification email using Resend
    await sendContactFormNotification(contactData)

    return { 
      success: true, 
      message: "Thank you for your message. We'll get back to you soon!" 
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error: " + error.errors.map(e => e.message).join(", ")
      }
    }
    
    return {
      success: false,
      message: "Failed to submit contact form. Please try again."
    }
  }
}

export async function requestQuote(formData: FormData) {
  const supabase = createServerClient()

  try {
    // Extract and sanitize form data
    const rawData = {
      name: sanitizeInput(formData.get("name") as string),
      email: sanitizeInput(formData.get("email") as string),
      phone: sanitizeInput(formData.get("phone") as string || ""),
      service: sanitizeInput(formData.get("service") as string),
      property_type: formData.get("property_type") as string || undefined,
      property_size: sanitizeInput(formData.get("property_size") as string || ""),
      urgency: formData.get("urgency") as string || undefined,
      description: sanitizeInput(formData.get("description") as string || ""),
    }

    // Validate data using Zod schema
    const validatedData = QuoteRequestSchema.parse(rawData)

    const quoteData = {
      ...validatedData,
      created_at: new Date().toISOString(),
      status: "pending" as const,
      estimated_price: null, // Will be filled by admin
    }

    // Save to database
    const { error } = await supabase.from("quote_requests").insert(quoteData)
    if (error) throw error

    // Send notification email using Resend
    await sendQuoteRequestNotification(quoteData)

    return { 
      success: true, 
      message: "Quote request submitted! We'll contact you within 24 hours." 
    }
  } catch (error) {
    console.error("Error submitting quote request:", error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error: " + error.errors.map(e => e.message).join(", ")
      }
    }
    
    return {
      success: false,
      message: "Failed to submit quote request. Please try again."
    }
  }
}
