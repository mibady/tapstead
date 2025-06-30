import { supabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export async function createBooking(bookingData: Database["public"]["Tables"]["bookings"]["Insert"]) {
  
  if (!supabase) {
    throw new Error("Service temporarily unavailable");
  }
  
  const { data, error } = await supabase
    .from("bookings")
    .insert(bookingData)
    .select()
    .single();
    
  if (error) {
    console.error("Error creating booking:", error);
    throw new Error(`Failed to create booking: ${error.message}`);
  }
  
  return data;
}

export async function getUserBookings(userId: string) {
  
  if (!supabase) {
    return [];
  }
  
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services (*),
      providers (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    return [];
  }
  
  return data || [];
}

export async function getBookingById(bookingId: string) {
  
  if (!supabase) {
    return null;
  }
  
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services (*),
      providers (*),
      tracking (*)
    `)
    .eq("id", bookingId)
    .single();
    
  if (error) {
    console.error(`Error fetching booking with id ${bookingId}:`, error);
    return null;
  }
  
  return data;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  
  if (!supabase) {
    throw new Error("Service temporarily unavailable");
  }
  
  const { data, error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating booking status for ${bookingId}:`, error);
    throw new Error(`Failed to update booking status: ${error.message}`);
  }
  
  return data;
}
