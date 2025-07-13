import { type NextRequest, NextResponse } from "next/server"
import { retellService } from "@/lib/integrations/retell-ai"
import { createServerClient } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, message, type = "general" } = body

    if (!to || !message) {
      return NextResponse.json({ error: "Missing to number or message" }, { status: 400 })
    }

    // Send SMS via Retell AI
    const smsResponse = await retellService.sendSMS({
      to,
      message,
      from: process.env.RETELL_PHONE_NUMBER,
    })

    // Log SMS in database
    const supabase = createServerClient()
    await supabase.from("sms_logs").insert({
      to_number: to,
      message,
      type,
      status: "sent",
      external_id: smsResponse.id,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      messageId: smsResponse.id,
      message: "SMS sent successfully",
    })
  } catch (error) {
    console.error("SMS send error:", error)
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
  }
}

// Webhook endpoint for SMS delivery status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, status, deliveredAt, errorMessage } = body

    // Update SMS log in database
    const supabase = createServerClient()
    await supabase
      .from("sms_logs")
      .update({
        status,
        delivered_at: deliveredAt,
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("external_id", messageId)

    return NextResponse.json({
      success: true,
      message: "SMS status updated",
    })
  } catch (error) {
    console.error("SMS status update error:", error)
    return NextResponse.json({ error: "Failed to update SMS status" }, { status: 500 })
  }
}

// Get SMS templates for different scenarios
export async function GET() {
  const templates = {
    booking_confirmation: {
      template:
        "Hi {name}! Your {service} is confirmed for {date} at {time}. Address: {address}. Questions? Reply or call us!",
      variables: ["name", "service", "date", "time", "address"],
    },
    booking_reminder: {
      template: "Reminder: Your {service} appointment is tomorrow at {time}. We'll see you at {address}!",
      variables: ["service", "time", "address"],
    },
    provider_assignment: {
      template: "Great news! {provider} will handle your {service} on {date}. They'll call 15 mins before arrival.",
      variables: ["provider", "service", "date"],
    },
    service_complete: {
      template:
        "Your {service} is complete! Please rate your experience: {rating_link}. Thank you for choosing Tapstead!",
      variables: ["service", "rating_link"],
    },
    quote_ready: {
      template: "Your quote for {service} is ready! View it here: {quote_link}. Valid for 7 days.",
      variables: ["service", "quote_link"],
    },
  }

  return NextResponse.json({
    success: true,
    templates,
    message: "SMS templates retrieved successfully",
  })
}
