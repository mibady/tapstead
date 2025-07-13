import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    const { data: quote, error } = await supabase.from("quote_requests").select("*").eq("id", id).single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error("Error fetching quote:", error)
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params
    const updates = await request.json()

    const { data: quote, error } = await supabase
      .from("quote_requests")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update quote" }, { status: 500 })
    }

    // If quote is approved, create booking
    if (updates.status === "approved" && updates.final_price) {
      try {
        const { data: booking, error: bookingError } = await supabase
          .from("bookings")
          .insert({
            customer_name: quote.customer_name,
            customer_email: quote.customer_email,
            customer_phone: quote.customer_phone,
            service_type: quote.service_type,
            property_type: quote.property_type,
            bedrooms: quote.bedrooms,
            bathrooms: quote.bathrooms,
            square_footage: quote.square_footage,
            address: quote.address,
            scheduled_date: quote.preferred_date,
            total_amount: updates.final_price,
            status: "confirmed",
            quote_request_id: quote.id,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (bookingError) {
          console.error("Booking creation error:", bookingError)
        } else {
          // Update quote with booking ID
          await supabase.from("quote_requests").update({ booking_id: booking.id }).eq("id", id)
        }
      } catch (bookingError) {
        console.error("Error creating booking from quote:", bookingError)
      }
    }

    return NextResponse.json({
      success: true,
      quote,
      message: "Quote updated successfully",
    })
  } catch (error) {
    console.error("Error updating quote:", error)
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    const { error } = await supabase.from("quote_requests").delete().eq("id", id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting quote:", error)
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 })
  }
}
