import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BookingFlow } from "@/components/booking/booking-flow"

// Mock the booking service
vi.mock("@/lib/actions/booking-actions", () => ({
  createBooking: vi.fn(),
  calculatePrice: vi.fn(),
}))

describe("BookingFlow Component", () => {
  it("should render booking form", () => {
    render(<BookingFlow />)

    expect(screen.getByText("Book Your Service")).toBeInTheDocument()
    expect(screen.getByLabelText(/home size/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/service frequency/i)).toBeInTheDocument()
  })

  it("should calculate price based on selections", async () => {
    const { calculatePrice } = await import("@/lib/actions/booking-actions")
    vi.mocked(calculatePrice).mockResolvedValueOnce({
      basePrice: 199,
      discount: 53.73,
      finalPrice: 145.27,
      savings: 53.73,
    })

    render(<BookingFlow />)

    // Select medium home
    const homeSizeSelect = screen.getByLabelText(/home size/i)
    fireEvent.change(homeSizeSelect, { target: { value: "medium" } })

    // Select bi-weekly frequency
    const frequencySelect = screen.getByLabelText(/service frequency/i)
    fireEvent.change(frequencySelect, { target: { value: "biweekly" } })

    await waitFor(() => {
      expect(screen.getByText("$145.27")).toBeInTheDocument()
      expect(screen.getByText(/save \$53\.73/i)).toBeInTheDocument()
    })
  })

  it("should handle form submission", async () => {
    const { createBooking } = await import("@/lib/actions/booking-actions")
    vi.mocked(createBooking).mockResolvedValueOnce({
      id: "booking-123",
      status: "confirmed",
    })

    render(<BookingFlow />)

    // Fill out form
    fireEvent.change(screen.getByLabelText(/home size/i), { target: { value: "small" } })
    fireEvent.change(screen.getByLabelText(/service frequency/i), { target: { value: "weekly" } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: "123 Main St" } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+1234567890" } })

    // Submit form
    const submitButton = screen.getByRole("button", { name: /book now/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(createBooking).toHaveBeenCalledWith(
        expect.objectContaining({
          homeSize: "small",
          frequency: "weekly",
          address: "123 Main St",
          phone: "+1234567890",
        }),
      )
    })
  })

  it("should show validation errors", async () => {
    render(<BookingFlow />)

    // Try to submit without required fields
    const submitButton = screen.getByRole("button", { name: /book now/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/address is required/i)).toBeInTheDocument()
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
    })
  })

  it("should handle add-ons selection", async () => {
    const { calculatePrice } = await import("@/lib/actions/booking-actions")
    vi.mocked(calculatePrice).mockResolvedValueOnce({
      basePrice: 149,
      addOns: 75,
      finalPrice: 224,
      savings: 0,
    })

    render(<BookingFlow />)

    // Select deep clean add-on
    const deepCleanCheckbox = screen.getByLabelText(/deep clean/i)
    fireEvent.click(deepCleanCheckbox)

    await waitFor(() => {
      expect(screen.getByText("$224")).toBeInTheDocument()
    })
  })
})
