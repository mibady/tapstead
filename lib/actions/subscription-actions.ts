"use server"

import { createServerClient } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

export async function createSubscription(planType: string, monthlyPrice: number) {
  const supabase = createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  try {
    // Cancel existing subscription
    await supabase.from("subscriptions").update({ status: "cancelled" }).eq("user_id", user.id).eq("status", "active")

    // Create new subscription
    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_type: planType,
      status: "active",
      monthly_price: monthlyPrice,
      next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      services_included: ["cleaning", "handyman", "junk-removal"],
      discount_percentage: planType === "Premium Care" ? 25 : planType === "Home Care Plus" ? 15 : 0,
    })

    if (error) throw error

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error creating subscription:", error)
    throw new Error("Failed to create subscription")
  }
}

export async function cancelSubscription() {
  const supabase = createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("status", "active")

    if (error) throw error

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    throw new Error("Failed to cancel subscription")
  }
}
