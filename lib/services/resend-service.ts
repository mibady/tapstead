import { Resend } from "resend"
import { WelcomeEmail } from "@/emails/welcome-email"
import { BookingConfirmationEmail } from "@/emails/booking-confirmation-email"
import { ContactNotificationEmail } from "@/emails/contact-notification-email"
import { QuoteRequestEmail } from "@/emails/quote-request-email"
import { ProviderApplicationEmail } from "@/emails/provider-application-email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Tapstead <welcome@tapstead.com>",
      to: [email],
      subject: "Welcome to Tapstead - Your Home Services Platform!",
      react: WelcomeEmail({ name }),
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error }
  }
}

export async function sendBookingConfirmation(email: string, booking: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Tapstead Bookings <bookings@tapstead.com>",
      to: [email],
      subject: `Booking Confirmed: ${booking.service_title} - ${booking.scheduled_date}`,
      react: BookingConfirmationEmail({ booking }),
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending booking confirmation:", error)
    return { success: false, error }
  }
}

export async function sendContactFormNotification(contactData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Tapstead Notifications <notifications@tapstead.com>",
      to: ["admin@tapstead.com"],
      subject: `🔔 New Contact Form: ${contactData.service || "General Inquiry"}`,
      react: ContactNotificationEmail({ contactData }),
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending contact notification:", error)
    return { success: false, error }
  }
}

export async function sendQuoteRequestNotification(quoteData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Tapstead Quotes <quotes@tapstead.com>",
      to: ["quotes@tapstead.com"],
      subject: `💰 New Quote Request: ${quoteData.service}`,
      react: QuoteRequestEmail({ quoteData }),
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending quote request notification:", error)
    return { success: false, error }
  }
}

export async function sendProviderApplicationNotification(applicationData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Tapstead Providers <providers@tapstead.com>",
      to: ["providers@tapstead.com"],
      subject: `👷 New Provider Application: ${applicationData.business_name}`,
      react: ProviderApplicationEmail({ applicationData }),
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending provider application notification:", error)
    return { success: false, error }
  }
}

export async function sendProviderWelcomeEmail(email: string, providerData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Tapstead Provider Network <providers@tapstead.com>",
      to: [email],
      subject: "Welcome to the Tapstead Provider Network!",
      react: WelcomeEmail({
        name: providerData.business_name,
        isProvider: true,
      }),
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending provider welcome email:", error)
    return { success: false, error }
  }
}

// Newsletter signup using Resend Audiences
export async function addToNewsletter(email: string, firstName?: string) {
  try {
    const { data, error } = await resend.contacts.create({
      email,
      firstName,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    })

    if (error) {
      console.error("Resend audience error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error adding to newsletter:", error)
    return { success: false, error }
  }
}
