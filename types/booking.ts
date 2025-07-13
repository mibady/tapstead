export interface Service {
  id: string
  icon: any
  title: string
  description: string
  basePrice: number
  duration: string
  popular: boolean
  features: string[]
}

export interface BookingDetails {
  address: string
  date: string
  time: string
  specialInstructions: string
  homeSize: string
  urgency: string
  estimatedPrice: number
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  customerType: string
  militaryStatus: boolean
  isNewCustomer: boolean
  marketingOptIn: boolean
  appliedDiscount: number
}

export interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
  billingZip: string
  paymentConfirmed: boolean
  finalTotal: number
  bookingId: string
}

export interface BookingData {
  service: Service | null
  details: BookingDetails | null
  customer: CustomerInfo | null
  payment: PaymentInfo | null
}
