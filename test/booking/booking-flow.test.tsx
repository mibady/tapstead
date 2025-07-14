import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BookingFlow } from "@/components/booking/booking-flow"
import { PricingCalculator } from "@/lib/pricing/calculator"

// Mock dependencies
vi.mock("@/lib/pricing/calculator")
vi.mock("@/lib/supabase/client")
vi.mock("@stripe/react-stripe-js")

const mockPricingResult = {
  basePrice: 149,
  finalPrice: 149,
  subscriptionDiscount: 0,
  addOnTotal: 0,
  dynamicPricingMultiplier: 1,
  savings: 0,
  breakdown: {
    base: 149,
    addOns: {},
    discounts: {},
    surcharges: {},
  },
}

describe("BookingFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(PricingCalculator.calculatePricing).mockResolvedValue(mockPricingResult)
  })

  it("should render initial step with service selection", () => {
    render(<BookingFlow />)

    expect(screen.getByText("Select Your Service")).toBeInTheDocument()
    expect(screen.getByText("House Cleaning")).toBeInTheDocument()
  })

  it("should progress through steps when house cleaning is selected", async () => {
    const user = userEvent.setup()
    render(<BookingFlow />)

    // Select house cleaning
    await user.click(screen.getByText("House Cleaning"))
    await user.click(screen.getByText("Continue"))

    // Should show house size selection
    await waitFor(() => {
      expect(screen.getByText("Select House Size")).toBeInTheDocument()
    })
  })

  it("should calculate pricing when house size is selected", async () => {
    const user = userEvent.setup()
    render(<BookingFlow />)

    // Navigate to house size step
    await user.click(screen.getByText("House Cleaning"))
    await user.click(screen.getByText("Continue"))

    // Select small house
    await user.click(screen.getByText("Small (1-2 bedrooms)"))

    await waitFor(() => {
      expect(PricingCalculator.calculatePricing).toHaveBeenCalledWith(
        expect.objectContaining({
          houseSize: "small",
          frequency: "one-time",
          addOns: [],
        }),
      )
    })
  })

  it("should update pricing when frequency changes", async () => {
    const user = userEvent.setup()
    render(<BookingFlow />)

    // Navigate through steps
    await user.click(screen.getByText("House Cleaning"))
    await user.click(screen.getByText("Continue"))
    await user.click(screen.getByText("Small (1-2 bedrooms)"))
    await user.click(screen.getByText("Continue"))

    // Change frequency
    await user.click(screen.getByText("Weekly"))

    await waitFor(() => {
      expect(PricingCalculator.calculatePricing).toHaveBeenCalledWith(
        expect.objectContaining({
          frequency: "weekly",
        }),
      )
    })
  })

  it("should show quote request form for non-cleaning services", async () => {
    const user = userEvent.setup()
    render(<BookingFlow />)

    // Select handyman service
    await user.click(screen.getByText("Handyman"))
    await user.click(screen.getByText("Continue"))

    await waitFor(() => {
      expect(screen.getByText("Request a Quote")).toBeInTheDocument()
      expect(screen.getByText("Project Details")).toBeInTheDocument()
    })
  })

  it("should validate required fields before proceeding", async () => {
    const user = userEvent.setup()
    render(<BookingFlow />)

    // Try to continue without selecting service
    await user.click(screen.getByText("Continue"))

    expect(screen.getByText("Please select a service")).toBeInTheDocument()
  })

  it("should show pricing breakdown", async () => {
    const user = userEvent.setup()

    // Mock pricing with add-ons and discounts
    const pricingWithAddons = {
      ...mockPricingResult,
      addOnTotal: 75,
      finalPrice: 224,
      breakdown: {
        base: 149,
        addOns: { deepClean: 75 },
        discounts: {},
        surcharges: {},
      },
    }
    vi.mocked(PricingCalculator.calculatePricing).mockResolvedValue(pricingWithAddons)

    render(<BookingFlow />)

    // Navigate to add-ons step
    await user.click(screen.getByText("House Cleaning"))
    await user.click(screen.getByText("Continue"))
    await user.click(screen.getByText("Small (1-2 bedrooms)"))
    await user.click(screen.getByText("Continue"))
    await user.click(screen.getByText("Continue")) // Skip frequency

    // Select deep clean add-on
    await user.click(screen.getByText("Deep Clean (+$75)"))

    await waitFor(() => {
      expect(screen.getByText("$149")).toBeInTheDocument() // Base price
      expect(screen.getByText("$75")).toBeInTheDocument() // Add-on price
      expect(screen.getByText("$224")).toBeInTheDocument() // Total price
    })
  })
})
