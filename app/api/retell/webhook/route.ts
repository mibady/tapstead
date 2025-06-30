import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, call } = body

    // Log the webhook event
    console.log('Retell webhook received:', { event, callId: call?.call_id })

    const supabase = createServerClient()

    // Early return if supabase is not available
    if (!supabase) {
      console.warn('Supabase not available - skipping webhook logging')
      return NextResponse.json({ received: true })
    }

    switch (event) {
      case 'call_started':
        // Log call start
        await supabase
          .from('agent_interactions')
          .insert({
            agent_type: 'phone_booking',
            session_id: call.call_id,
            success: true,
            user_input: 'Phone call initiated',
            agent_response: 'Call started',
            created_at: new Date().toISOString()
          })
        break

      case 'call_ended':
        // Log call completion and any booking data
        const callSummary = call.call_analysis?.summary || 'Call completed'
        
        await supabase
          .from('agent_interactions')
          .insert({
            agent_type: 'phone_booking',
            session_id: call.call_id,
            success: call.disconnect_reason !== 'error',
            user_input: 'Phone call completed',
            agent_response: callSummary,
            response_time_ms: call.duration_ms || 0,
            created_at: new Date().toISOString()
          })

        // If this was a booking call, extract any booking information
        if (call.metadata?.source === 'tapstead_booking_agent') {
          // Process booking information from call analysis
          // This would typically involve parsing the call transcript
          // and extracting booking details
        }
        break

      case 'call_transcript':
        // Store important parts of the conversation
        // This could be used for quality assurance and training
        break

      default:
        console.log('Unhandled webhook event:', event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Retell webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Verify webhook signature (recommended for production)
function verifyWebhookSignature(req: NextRequest, body: string): boolean {
  // Implement signature verification based on Retell's documentation
  // This ensures the webhook is actually from Retell AI
  return true // Simplified for now
}