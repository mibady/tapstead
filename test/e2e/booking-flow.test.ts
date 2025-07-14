import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BookingFlow } from "@/components/booking/booking-flow"
import { PricingCalculator } from "@/lib/pricing/calculator"

// Mock all external dependencies
vi.mock("@/lib/pricing/calculator")
vi.mock("@/lib/supabase/client")
vi.mock("@stripe/react-stripe-js")
vi.mock("@/lib/services/resend-service")

describe("E2E: Complete Booking Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock pricing calculator
    vi.mocked(PricingCalculator.calculatePricing).mockResolvedValue({
      basePrice: 149,
      finalPrice: 99.83,
      subscriptionDiscount: 0.33,
      addOnTotal: 0,
      dynamicPricingMultiplier: 1,
      savings: 49.17,
      breakdown: {
        base: 149,
        addOns: {},
        discounts: { subscription: 49.17 },
        surcharges: {},
      },
    })
  })

  it("should complete house cleaning booking flow in under 3 minutes", async () => {
    const user = userEvent.setup()
    const startTime = Date.now()

    render(<BookingFlow />)

    // Step 1: Service Selection (Target: < 10 seconds)
    await user.click(screen.getByText("House Cleaning"))
    await user.click(screen.getByText("Continue"))

    // Step 2: House Size Selection (Target: < 10 seconds)
    await waitFor(() => {
      expect(screen.getByText("Select House Size")).toBeInTheDocument()
    })
    await user.click(screen.getByText("Small (1-2 bedrooms)"))
    await user.click(screen.getByText("Continue"))

    // Step 3: Frequency Selection (Target: < 15 seconds)
    await waitFor(() => {
      expect(screen.getByText("How often would you like cleaning?")).toBeInTheDocument()
    })
    await user.click(screen.getByText("Weekly"))
    await user.click(screen.getByText("Continue"))

    // Step 4: Add-ons Selection (Target: < 20 seconds)
    await waitFor(() => {
      expect(screen.getByText("Add-on Services")).toBeInTheDocument()
    })
    // Skip add-ons
    await user.click(screen.getByText("Continue"))

    // Step 5: Date Selection (Target: < 30 seconds)
    await waitFor(() => {
      expect(screen.getByText("Select Date & Time")).toBeInTheDocument()
    })

    // Select tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByText(tomorrow.getDate().toString())
    await user.click(tomorrowButton)

    // Select time slot
    await user.click(screen.getByText("10:00 AM"))
    await user.click(screen.getByText("Continue"))

    // Step 6: Address Entry (Target: < 60 seconds)
    await waitFor(() => {
      expect(screen.getByText("Service Address")).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Street Address"), "123 Test Street")
    await user.type(screen.getByLabelText("City"), "Test City")
    await user.selectOptions(screen.getByLabelText("State"), "CA")
    await user.type(screen.getByLabelText("ZIP Code"), "12345")
    await user.click(screen.getByText("Continue"))

    // Step 7: Customer Info (Target: < 30 seconds)
    await waitFor(() => {
      expect(screen.getByText("Contact Information")).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Full Name"), "John Doe")
    await user.type(screen.getByLabelText("Phone Number"), "555-123-4567")
    await user.type(screen.getByLabelText("Email"), "john@example.com")
    await user.click(screen.getByText("Continue"))

    // Step 8: Payment (Target: < 60 seconds)
    await waitFor(() => {
      expect(screen.getByText("Payment Information")).toBeInTheDocument()
    })

    // Verify pricing is displayed
    expect(screen.getByText("$99.83")).toBeInTheDocument()
    expect(screen.getByText("Save $49.17")).toBeInTheDocument()

    const endTime = Date.now()
    const totalTime = (endTime - startTime) / 1000 // Convert to seconds

    // Verify completion time is under 3 minutes (180 seconds)
    expect(totalTime).toBeLessThan(180)

    console.log(`Booking flow completed in ${totalTime} seconds`)
  }, 30000) // 30 second timeout for the test

  it("should handle quote request flow efficiently", async () => {
    const user = userEvent.setup()
    const startTime = Date.now()

    render(<BookingFlow />)

    // Select non-cleaning service
    await user.click(screen.getByText("Handyman"))
    await user.click(screen.getByText("Continue"))

    // Fill quote request form
    await waitFor(() => {
      expect(screen.getByText("Request a Quote")).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Project Details"), "Need to fix a leaky faucet")
    await user.type(screen.getByLabelText("Street Address"), "123 Test Street")
    await user.selectOptions(screen.getByLabelText("Property Type"), "house")
    await user.selectOptions(screen.getByLabelText("Property Size"), "medium")

    // Select preferred date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateInput = screen.getByLabelText("Preferred Date")
    await user.type(dateInput, tomorrow.toISOString().split("T")[0])

    await user.selectOptions(screen.getByLabelText("Urgency"), "normal")
    await user.type(screen.getByLabelText("Full Name"), "Jane Doe")
    await user.type(screen.getByLabelText("Phone Number"), "555-987-6543")
    await user.type(screen.getByLabelText("Email"), "jane@example.com")

    await user.click(screen.getByText("Submit Quote Request"))

    const endTime = Date.now()
    const totalTime = (endTime - startTime) / 1000

    // Quote requests should be even faster - under 2 minutes
    expect(totalTime).toBeLessThan(120)

    console.log(`Quote request completed in ${totalTime} seconds`)
  })

  it("should validate all required fields", async () => {
    const user = userEvent.setup()
    render(<BookingFlow />)

    // Try to proceed without selecting service
    await user.click(screen.getByText("Continue"))
    expect(screen.getByText("Please select a service")).toBeInTheDocument()

    // Select house cleaning and proceed
    await user.click(screen.getByText("House Cleaning"))
    await user.click(screen.getByText("Continue"))

    // Try to proceed without selecting house size
    await user.click(screen.getByText("Continue"))
    expect(screen.getByText("Please select a house size")).toBeInTheDocument()

    // Continue through flow and test address validation
    await user.click(screen.getByText("Small (1-2 bedrooms)"))
    await user.click(screen.getByText("Continue"))
    await user.click(screen.getByText("Continue")) // Skip frequency
    await user.click(screen.getByText("Continue")) // Skip add-ons

    // Skip date selection for now and test address validation
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    await user.click(screen.getByText(tomorrow.getDate().toString()))
    await user.click(screen.getByText("10:00 AM"))
    await user.click(screen.getByText("Continue"))

    // Try to proceed without address
    await user.click(screen.getByText("Continue"))
    expect(screen.getByText("Street address is required")).toBeInTheDocument()
  })

  it("should handle errors gracefully", async () => {
    const user = userEvent.setup()

    // Mock pricing calculator to throw error
    vi.mocked(PricingCalculator.calculatePricing).mockRejectedValue(new Error("Pricing service unavailable"))

    render(<BookingFlow />)

    await user.click(screen.getByText("House Cleaning"))
    await user.click(screen.getByText("Continue"))
    await user.click(screen.getByText("Small (1-2 bedrooms)"))

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText("Unable to calculate pricing. Please try again.")).toBeInTheDocument()
    })
  })
})
