import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { resendService } from "@/lib/services/resend-service"
import crypto from "crypto"

interface RetellWebhookEvent {
  event: "call_started" | "call_ended" | "call_analyzed"
  call: {
    call_type: "phone_call" | "web_call"
    from_number?: string
    to_number?: string
    direction?: "inbound" | "outbound"
    call_id: string
    agent_id: string
    call_status: string
    metadata?: Record<string, any>
    retell_llm_dynamic_variables?: Record<string, any>
    start_timestamp?: number
    end_timestamp?: number
    disconnection_reason?: string
    transcript?: string
    transcript_object?: Array<{
      role: "agent" | "user"
      content: string
      words: Array<{
        word: string
        start: number
        end: number
      }>
    }>
    transcript_with_tool_calls?: Array<any>
    opt_out_sensitive_data_storage?: boolean
    call_analysis?: {
      call_summary?: string
      user_sentiment?: "Positive" | "Negative" | "Neutral" | "Unknown"
      call_successful?: boolean
      custom_analysis_data?: Record<string, any>
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-retell-signature")

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.RETELL_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")

      if (signature !== expectedSignature) {
        console.error("Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const event: RetellWebhookEvent = JSON.parse(body)
    const supabase = await createClient()

    console.log(`Retell webhook received: ${event.event} for call ${event.call.call_id}`)

    switch (event.event) {
      case "call_started":
        await handleCallStarted(supabase, event.call)
        break
      case "call_ended":
        await handleCallEnded(supabase, event.call)
        break
      case "call_analyzed":
        await handleCallAnalyzed(supabase, event.call)
        break
      default:
        console.log("Unhandled webhook event:", event.event)
    }

    // Return 2xx status as expected by Retell
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Retell webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleCallStarted(supabase: any, call: RetellWebhookEvent["call"]) {
  try {
    // Log call start
    const { error } = await supabase.from("call_logs").insert({
      call_id: call.call_id,
      agent_id: call.agent_id,
      call_type: call.call_type,
      from_number: call.from_number,
      to_number: call.to_number,
      direction: call.direction,
      status: "started",
      start_timestamp: call.start_timestamp,
      metadata: call.metadata,
      retell_llm_dynamic_variables: call.retell_llm_dynamic_variables,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error logging call start:", error)
    }
  } catch (error) {
    console.error("Error handling call started:", error)
  }
}

async function handleCallEnded(supabase: any, call: RetellWebhookEvent["call"]) {
  try {
    // Update call log with end details
    const { error } = await supabase
      .from("call_logs")
      .update({
        status: "ended",
        end_timestamp: call.end_timestamp,
        transcript: call.transcript,
        transcript_object: call.transcript_object,
        transcript_with_tool_calls: call.transcript_with_tool_calls,
        disconnection_reason: call.disconnection_reason,
        opt_out_sensitive_data_storage: call.opt_out_sensitive_data_storage,
        updated_at: new Date().toISOString(),
      })
      .eq("call_id", call.call_id)

    if (error) {
      console.error("Error updating call log:", error)
    }

    // Process any booking or quote requests from the call
    if (call.metadata?.booking_intent) {
      await processBookingFromCall(supabase, call)
    }

    if (call.metadata?.quote_request) {
      await processQuoteFromCall(supabase, call)
    }
  } catch (error) {
    console.error("Error handling call ended:", error)
  }
}

async function handleCallAnalyzed(supabase: any, call: RetellWebhookEvent["call"]) {
  try {
    // Update call log with analysis
    const { error } = await supabase
      .from("call_logs")
      .update({
        call_analysis: call.call_analysis,
        updated_at: new Date().toISOString(),
      })
      .eq("call_id", call.call_id)

    if (error) {
      console.error("Error updating call analysis:", error)
    }

    // Send follow-up emails based on analysis
    if (call.call_analysis?.call_successful && call.metadata?.customer_email) {
      await sendFollowUpEmail(call)
    }

    // Trigger any post-call workflows
    await triggerPostCallWorkflows(supabase, call)
  } catch (error) {
    console.error("Error handling call analyzed:", error)
  }
}

async function processBookingFromCall(supabase: any, call: RetellWebhookEvent["call"]) {
  const bookingData = call.metadata?.booking_data
  if (!bookingData) return

  try {
    // Create booking record
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        service_type: bookingData.service_type,
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        customer_phone: bookingData.customer_phone || call.from_number,
        address: bookingData.address,
        scheduled_date: bookingData.scheduled_date,
        scheduled_time: bookingData.scheduled_time,
        pricing_tier: bookingData.pricing_tier,
        frequency: bookingData.frequency,
        add_ons: bookingData.add_ons,
        total_amount: bookingData.total_amount,
        status: "pending_payment",
        source: "phone_call",
        call_id: call.call_id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating booking from call:", error)
      return
    }

    // Send confirmation email
    await resendService.sendBookingConfirmation(bookingData.customer_email, booking)

    console.log(`Booking created from call ${call.call_id}:`, booking.id)
  } catch (error) {
    console.error("Error processing booking from call:", error)
  }
}

async function processQuoteFromCall(supabase: any, call: RetellWebhookEvent["call"]) {
  const quoteData = call.metadata?.quote_data
  if (!quoteData) return

  try {
    // Create quote request record
    const { data: quote, error } = await supabase
      .from("quote_requests")
      .insert({
        service: quoteData.service,
        customer_name: quoteData.customer_name,
        customer_email: quoteData.customer_email,
        customer_phone: quoteData.customer_phone || call.from_number,
        description: quoteData.description,
        address: quoteData.address,
        preferred_date: quoteData.preferred_date,
        urgency: quoteData.urgency || "standard",
        status: "pending",
        source: "phone_call",
        call_id: call.call_id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating quote from call:", error)
      return
    }

    // Send quote request notification to operations team
    await resendService.sendQuoteRequestNotification(quote)

    console.log(`Quote request created from call ${call.call_id}:`, quote.id)
  } catch (error) {
    console.error("Error processing quote from call:", error)
  }
}

async function sendFollowUpEmail(call: RetellWebhookEvent["call"]) {
  const customerEmail = call.metadata?.customer_email
  const customerName = call.metadata?.customer_name

  if (!customerEmail || !customerName) return

  try {
    await resendService.sendContactFormAutoReply(customerEmail, {
      name: customerName,
      email: customerEmail,
      service: call.metadata?.service || "Phone consultation",
      message: "Thank you for calling Tapstead. We'll follow up on your request shortly.",
    })
  } catch (error) {
    console.error("Error sending follow-up email:", error)
  }
}

async function triggerPostCallWorkflows(supabase: any, call: RetellWebhookEvent["call"]) {
  try {
    // Update analytics
    await supabase.from("call_analytics").insert({
      call_id: call.call_id,
      agent_id: call.agent_id,
      call_duration: call.end_timestamp && call.start_timestamp ? call.end_timestamp - call.start_timestamp : null,
      user_sentiment: call.call_analysis?.user_sentiment,
      call_successful: call.call_analysis?.call_successful,
      disconnection_reason: call.disconnection_reason,
      created_at: new Date().toISOString(),
    })

    // Trigger any additional workflows based on call outcome
    if (call.call_analysis?.call_successful === false) {
      // Schedule follow-up for unsuccessful calls
      console.log(`Scheduling follow-up for unsuccessful call: ${call.call_id}`)
    }
  } catch (error) {
    console.error("Error triggering post-call workflows:", error)
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Retell webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
