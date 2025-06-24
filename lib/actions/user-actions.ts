"use server"

import { createServerClient } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

export async function updateUserProfile(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  const userData = {
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zip_code: formData.get("zip_code") as string,
  }

  const { error } = await supabase.from("users").update(userData).eq("id", user.id)

  if (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }

  revalidatePath("/dashboard")
  return { success: true, message: "Profile updated successfully" }
}

export async function getUserProfile() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return profile
}

export async function deleteUserAccount() {
  // This is a sensitive operation and should be handled with care.
  // It should probably involve a confirmation step and a call to a Supabase edge function
  // that has the necessary privileges to delete a user from auth.users.
  console.warn("User account deletion is not fully implemented.")
  return { success: false, message: "Feature not implemented" }
}
