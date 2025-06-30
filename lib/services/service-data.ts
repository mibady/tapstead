import { supabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

export type Service = Database["public"]["Tables"]["services"]["Row"];

export async function getAllServices() {
  if (!supabase) {
    return [];
  }
  
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("title");
    
  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  
  return data || [];
}

export async function getServiceByCategory(category: string) {
  if (!supabase) {
    return [];
  }
  
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("category", category)
    .eq("active", true)
    .order("title");
    
  if (error) {
    console.error(`Error fetching services for category ${category}:`, error);
    return [];
  }
  
  return data || [];
}

export async function getServiceById(id: string) {
  if (!supabase) {
    return null;
  }
  
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    console.error(`Error fetching service with id ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function getServiceBySlug(slug: string) {
  // Convert slug to a searchable format (e.g., "house-cleaning" -> "House Cleaning")
  const searchTitle = slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  if (!supabase) {
    return null;
  }
  
  // Try to find by exact title match first
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .ilike("title", searchTitle);
    
  if (error) {
    console.error(`Error fetching service with slug ${slug}:`, error);
    return null;
  }
  
  if (data && data.length > 0) {
    return data[0];
  }
  
  // If not found by exact title, try to find by category
  if (!supabase) {
    return null;
  }
  
  const { data: categoryData, error: categoryError } = await supabase
    .from("services")
    .select("*")
    .eq("category", slug);
    
  if (categoryError) {
    console.error(`Error fetching service with category ${slug}:`, categoryError);
    return null;
  }
  
  return categoryData && categoryData.length > 0 ? categoryData[0] : null;
}

export async function getEmergencyServices() {
  if (!supabase) {
    return [];
  }
  
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .ilike("category", "%emergency%")
    .order("title");
    
  if (error) {
    console.error("Error fetching emergency services:", error);
    return [];
  }
  
  return data || [];
}
