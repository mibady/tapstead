import type React from "react"
import { Resend } from "resend"
import { BookingConfirmationEmail } from "@/emails/booking-confirmation-email"
import { QuoteRequestEmail } from "@/emails/quote-request-email"
import { WelcomeEmail } from "@/emails/welcome-email"
import { ContactNotificationEmail } from "@/emails/contact-notification-email"
import { ProviderApplicationEmail } from "@/emails/provider-application-email"

interface EmailOptions {
  to: string | string[]
  subject: string
  react?: React.ReactElement
  html?: string
  text?: string
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  tags?: Array<{ name: string; value: string }>
  headers?: Record<string, string>
}

interface BatchEmailOptions {
  emails: Array<{
    to: string
    subject: string
    react?: React.ReactElement
    html?: string
    text?: string
  }>
  from?: string
}

class ResendService {
  private resend: Resend
  private defaultFrom: string

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
    this.defaultFrom = "Tapstead <noreply@tapstead.com>"
  }

  async sendEmail(options: EmailOptions) {
    try {
      const result = await this.resend.emails.send({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        react: options.react,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
        tags: options.tags,
        headers: options.headers,
      })

      console.log("Email sent successfully:", result.data?.id)
      return result
    } catch (error) {
      console.error("Error sending email:", error)
      throw new Error(`Failed to send email: ${error}`)
    }
  }

  async sendBatchEmails(options: BatchEmailOptions) {
    try {
      const emails = options.emails.map((email) => ({
        from: options.from || this.defaultFrom,
        to: email.to,
        subject: email.subject,
        react: email.react,
        html: email.html,
        text: email.text,
      }))

      const result = await this.resend.batch.send(emails)
      console.log("Batch emails sent successfully:", result.data?.length)
      return result
    } catch (error) {
      console.error("Error sending batch emails:", error)
      throw new Error(`Failed to send batch emails: ${error}`)
    }
  }

  // Booking-related emails
  async sendBookingConfirmation(customerEmail: string, booking: any) {
    return this.sendEmail({
      to: customerEmail,
      subject: `Booking Confirmed - ${booking.service_type} on ${new Date(booking.scheduled_date).toLocaleDateString()}`,
      react: BookingConfirmationEmail({ booking }),
      tags: [
        { name: "category", value: "booking" },
        { name: "type", value: "confirmation" },
      ],
    })
  }

  async sendBookingReminder(customerEmail: string, booking: any) {
    return this.sendEmail({
      to: customerEmail,
      subject: `Reminder: ${booking.service_type} appointment tomorrow`,
      react: BookingConfirmationEmail({ booking, isReminder: true }),
      tags: [
        { name: "category", value: "booking" },
        { name: "type", value: "reminder" },
      ],
    })
  }

  async sendBookingCancellation(customerEmail: string, booking: any, reason?: string) {
    return this.sendEmail({
      to: customerEmail,
      subject: `Booking Cancelled - ${booking.service_type}`,
      html: `
        <h2>Booking Cancelled</h2>
        <p>Your ${booking.service_type} appointment scheduled for ${new Date(booking.scheduled_date).toLocaleDateString()} has been cancelled.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The Tapstead Team</p>
      `,
      tags: [
        { name: "category", value: "booking" },
        { name: "type", value: "cancellation" },
      ],
    })
  }

  // Quote-related emails
  async sendQuoteRequestNotification(quoteRequest: any) {
    return this.sendEmail({
      to: "operations@tapstead.com",
      subject: `New Quote Request - ${quoteRequest.service}`,
      react: QuoteRequestEmail({ quoteRequest }),
      tags: [
        { name: "category", value: "quote" },
        { name: "type", value: "notification" },
      ],
    })
  }

  async sendQuoteRequestConfirmation(customerEmail: string, quoteRequest: any) {
    return this.sendEmail({
      to: customerEmail,
      subject: "Quote Request Received - We'll call you within 2 hours",
      html: `
        <h2>Quote Request Received</h2>
        <p>Hi ${quoteRequest.customer_name},</p>
        <p>We've received your quote request for <strong>${quoteRequest.service}</strong>.</p>
        <p><strong>What happens next:</strong></p>
        <ul>
          <li>We'll review your request and call you within 2 hours</li>
          <li>Our team will discuss your project details and provide a quote</li>
          <li>If you approve, we'll schedule your service at your convenience</li>
        </ul>
        <p><strong>Your Request Details:</strong></p>
        <ul>
          <li><strong>Service:</strong> ${quoteRequest.service}</li>
          <li><strong>Description:</strong> ${quoteRequest.description}</li>
          <li><strong>Address:</strong> ${quoteRequest.address}</li>
          <li><strong>Preferred Date:</strong> ${quoteRequest.preferred_date ? new Date(quoteRequest.preferred_date).toLocaleDateString() : "Flexible"}</li>
        </ul>
        <p>Questions? Reply to this email or call us at ${process.env.RETELL_PHONE_NUMBER}</p>
        <p>Best regards,<br>The Tapstead Team</p>
      `,
      tags: [
        { name: "category", value: "quote" },
        { name: "type", value: "confirmation" },
      ],
    })
  }

  async sendQuoteResponse(customerEmail: string, quote: any) {
    return this.sendEmail({
      to: customerEmail,
      subject: `Your Quote is Ready - ${quote.service}`,
      html: `
        <h2>Your Quote is Ready</h2>
        <p>Hi ${quote.customer_name},</p>
        <p>We've prepared your quote for <strong>${quote.service}</strong>:</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Quote Details</h3>
          <p><strong>Service:</strong> ${quote.service}</p>
          <p><strong>Estimated Cost:</strong> $${quote.estimated_cost}</p>
          <p><strong>Timeline:</strong> ${quote.estimated_duration}</p>
          <p><strong>Valid Until:</strong> ${new Date(quote.expires_at).toLocaleDateString()}</p>
        </div>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Review the quote details above</li>
          <li>Call us at ${process.env.RETELL_PHONE_NUMBER} to accept and schedule</li>
          <li>Or reply to this email with any questions</li>
        </ul>
        <p>This quote is valid for 7 days. We're excited to help with your project!</p>
        <p>Best regards,<br>The Tapstead Team</p>
      `,
      tags: [
        { name: "category", value: "quote" },
        { name: "type", value: "response" },
      ],
    })
  }

  // User management emails
  async sendWelcomeEmail(userEmail: string, userData: any) {
    return this.sendEmail({
      to: userEmail,
      subject: "Welcome to Tapstead!",
      react: WelcomeEmail({ user: userData }),
      tags: [
        { name: "category", value: "user" },
        { name: "type", value: "welcome" },
      ],
    })
  }

  async sendPasswordResetEmail(userEmail: string, resetLink: string) {
    return this.sendEmail({
      to: userEmail,
      subject: "Reset Your Tapstead Password",
      html: `
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password for your Tapstead account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>Best regards,<br>The Tapstead Team</p>
      `,
      tags: [
        { name: "category", value: "user" },
        { name: "type", value: "password-reset" },
      ],
    })
  }

  // Contact and support emails
  async sendContactFormNotification(formData: any) {
    return this.sendEmail({
      to: "support@tapstead.com",
      subject: `New Contact Form Submission - ${formData.service}`,
      react: ContactNotificationEmail({ formData }),
      tags: [
        { name: "category", value: "contact" },
        { name: "type", value: "notification" },
      ],
    })
  }

  async sendContactFormAutoReply(customerEmail: string, formData: any) {
    return this.sendEmail({
      to: customerEmail,
      subject: "We received your message - Tapstead Support",
      html: `
        <h2>Thanks for contacting Tapstead!</h2>
        <p>Hi ${formData.name},</p>
        <p>We've received your message about <strong>${formData.service}</strong> and will get back to you within 24 hours.</p>
        <p><strong>Your Message:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 4px;">${formData.message}</p>
        <p>For urgent matters, you can call us at ${process.env.RETELL_PHONE_NUMBER}</p>
        <p>Best regards,<br>The Tapstead Support Team</p>
      `,
      tags: [
        { name: "category", value: "contact" },
        { name: "type", value: "auto-reply" },
      ],
    })
  }

  // Provider-related emails
  async sendProviderApplicationNotification(applicationData: any) {
    return this.sendEmail({
      to: "recruiting@tapstead.com",
      subject: `New Provider Application - ${applicationData.business_name}`,
      react: ProviderApplicationEmail({ application: applicationData }),
      tags: [
        { name: "category", value: "provider" },
        { name: "type", value: "application" },
      ],
    })
  }

  async sendProviderWelcomeEmail(providerEmail: string, providerData: any) {
    return this.sendEmail({
      to: providerEmail,
      subject: "Welcome to the Tapstead Provider Network!",
      html: `
        <h2>Welcome to Tapstead!</h2>
        <p>Hi ${providerData.contact_name},</p>
        <p>Congratulations! Your application to join the Tapstead provider network has been approved.</p>
        <p><strong>Your Provider Details:</strong></p>
        <ul>
          <li><strong>Business:</strong> ${providerData.business_name}</li>
          <li><strong>Services:</strong> ${providerData.services?.join(", ") || "N/A"}</li>
          <li><strong>Service Areas:</strong> ${providerData.service_areas?.join(", ") || "N/A"}</li>
        </ul>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Complete your provider profile setup</li>
          <li>Upload required certifications and insurance documents</li>
          <li>Set your availability and service areas</li>
          <li>Start receiving job requests!</li>
        </ol>
        <p>Login to your provider dashboard to get started: <a href="${process.env.NEXT_PUBLIC_APP_URL}/provider">Provider Dashboard</a></p>
        <p>Questions? Reply to this email or call us at ${process.env.RETELL_PHONE_NUMBER}</p>
        <p>Welcome to the team!<br>The Tapstead Team</p>
      `,
      tags: [
        { name: "category", value: "provider" },
        { name: "type", value: "welcome" },
      ],
    })
  }

  async sendProviderApplicationConfirmation(providerEmail: string, applicationData: any) {
    return this.sendEmail({
      to: providerEmail,
      subject: "Application Received - Tapstead Provider Network",
      html: `
        <h2>Application Received</h2>
        <p>Hi ${applicationData.contact_name},</p>
        <p>Thank you for applying to join the Tapstead provider network!</p>
        <p><strong>Application Details:</strong></p>
        <ul>
          <li><strong>Business:</strong> ${applicationData.business_name}</li>
          <li><strong>Services:</strong> ${applicationData.services?.join(", ") || "N/A"}</li>
          <li><strong>Service Areas:</strong> ${applicationData.service_areas?.join(", ") || "N/A"}</li>
        </ul>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>We'll review your application within 2 business days</li>
          <li>If approved, we'll schedule a brief phone interview</li>
          <li>Background check and verification process</li>
          <li>Onboarding and platform training</li>
        </ol>
        <p>We'll keep you updated throughout the process. Questions? Reply to this email.</p>
        <p>Best regards,<br>The Tapstead Recruiting Team</p>
      `,
      tags: [
        { name: "category", value: "provider" },
        { name: "type", value: "application-confirmation" },
      ],
    })
  }

  // Analytics and monitoring
  async getEmailAnalytics(params?: {
    startDate?: string
    endDate?: string
    tags?: string[]
  }) {
    try {
      // Note: Resend doesn't have a direct analytics API yet
      // This is a placeholder for when they add it
      console.log("Email analytics requested:", params)
      return { message: "Analytics feature coming soon" }
    } catch (error) {
      console.error("Error getting email analytics:", error)
      throw new Error(`Failed to get email analytics: ${error}`)
    }
  }
}

export const resendService = new ResendService()

// Named exports for the missing functions
export const sendBookingConfirmation = resendService.sendBookingConfirmation.bind(resendService)
export const sendQuoteRequestNotification = resendService.sendQuoteRequestNotification.bind(resendService)
export const sendContactFormNotification = resendService.sendContactFormNotification.bind(resendService)
export const sendProviderApplicationNotification = resendService.sendProviderApplicationNotification.bind(resendService)
export const sendProviderWelcomeEmail = resendService.sendProviderWelcomeEmail.bind(resendService)
export const sendWelcomeEmail = resendService.sendWelcomeEmail.bind(resendService)

export default resendService
