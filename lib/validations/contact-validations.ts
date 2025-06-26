import { z } from "zod"

// Contact form validation schema
export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true
      // Allow various phone formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
      const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)\.]{10,15}$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    }, "Please enter a valid phone number"),
  
  service: z
    .string()
    .max(100, "Service must be less than 100 characters")
    .optional(),
  
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
})

// Quote request validation schema
export const QuoteRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true
      const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)\.]{10,15}$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    }, "Please enter a valid phone number"),
  
  service: z
    .string()
    .min(1, "Please select a service")
    .max(100, "Service must be less than 100 characters"),
  
  property_type: z
    .enum(["residential", "commercial", "industrial"], {
      errorMap: () => ({ message: "Please select a valid property type" })
    })
    .optional(),
  
  property_size: z
    .string()
    .max(50, "Property size must be less than 50 characters")
    .optional(),
  
  urgency: z
    .enum(["low", "medium", "high", "emergency"], {
      errorMap: () => ({ message: "Please select a valid urgency level" })
    })
    .optional(),
  
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters")
    .optional()
})

// Newsletter subscription validation
export const NewsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
})

// Sanitize input data to prevent XSS and injection attacks
export function sanitizeInput(input: string): string {
  if (!input) return input
  
  return input
    .trim()
    // Remove potential HTML/script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    // Remove potential SQL injection patterns
    .replace(/[';"]?\s*(union|select|insert|update|delete|drop|create|alter|exec|execute|sp_|xp_)/gi, '')
    // Limit to safe characters for names and text
    .replace(/[^\w\s@.\-+()]/g, '')
}

// Type definitions
export type ContactFormData = z.infer<typeof ContactFormSchema>
export type QuoteRequestData = z.infer<typeof QuoteRequestSchema>
export type NewsletterData = z.infer<typeof NewsletterSchema>