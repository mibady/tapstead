import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/client"

const stripe = new Stripe(process.env.Stripe_Secret_key!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createServerClient()

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  const userId = paymentIntent.metadata.user_id
  const bookingType = paymentIntent.metadata.booking_type

  if (bookingType === "one-time") {
    // Update booking status to confirmed
    await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        stripe_payment_id: paymentIntent.id,
        status: "confirmed",
      })
      .eq("user_id", userId)
      .eq("stripe_payment_id", paymentIntent.id)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  if (invoice.subscription) {
    // Update subscription payment status
    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        last_payment_date: new Date().toISOString(),
        next_billing_date: new Date(invoice.period_end * 1000).toISOString(),
      })
      .eq("stripe_subscription_id", invoice.subscription)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  const userId = subscription.metadata.user_id

  // Create subscription record
  await supabase.from("subscriptions").insert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    plan_type: `House Cleaning - ${subscription.metadata.frequency}`,
    status: subscription.status,
    monthly_price: subscription.items.data[0].price.unit_amount! / 100,
    next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
    services_included: ["house-cleaning"],
    discount_percentage: getDiscountPercentage(subscription.metadata.frequency),
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  await supabase.from("subscriptions").update({ status: "cancelled" }).eq("stripe_subscription_id", subscription.id)
}

function getDiscountPercentage(frequency: string): number {
  switch (frequency) {
    case "weekly":
      return 33
    case "biweekly":
      return 27
    case "monthly":
      return 20
    default:
      return 0
  }
}
