/**
 * House cleaning pricing calculator
 * Placeholder implementation - TODO: Complete implementation
 */

export interface CleaningPriceInput {
  bedrooms?: string
  bathrooms?: string
  squareFootage?: string
  cleaningType?: string
  frequency?: string
  subscriptionTier?: string
  addOns?: {
    insideFridge?: boolean
    insideOven?: boolean
    outsideCabinets?: boolean
    topsOfCabinets?: boolean
    windowInteriors?: boolean
    blinds?: boolean
  }
  specialRequirements?: string
  [key: string]: any // Allow additional properties from the form
}

export interface PriceBreakdown {
  basePrice: number
  addOnPrice: number
  discountAmount: number
  total: number
  estimatedPrice: number
  estimatedDuration: number
  savings?: number
}

export function calculatePrice(input: CleaningPriceInput): PriceBreakdown {
  // Basic placeholder calculation
  const bedrooms = parseInt(input.bedrooms || '1')
  const bathrooms = parseInt(input.bathrooms || '1')
  
  // Base price calculation
  let basePrice = 80 // Base rate
  basePrice += bedrooms * 20 // $20 per bedroom
  basePrice += bathrooms * 15 // $15 per bathroom
  
  // Frequency discount based on subscription tier
  let discountAmount = 0
  if (input.subscriptionTier === 'weekly' || input.frequency === 'weekly') {
    discountAmount = basePrice * 0.15 // 15% discount
  } else if (input.subscriptionTier === 'biweekly' || input.frequency === 'biweekly') {
    discountAmount = basePrice * 0.10 // 10% discount
  }
  
  // Add-on pricing - count true values in addOns object
  const addOnCount = input.addOns ? Object.values(input.addOns).filter(Boolean).length : 0
  const addOnPrice = addOnCount * 25 // $25 per add-on
  
  const subtotal = basePrice + addOnPrice
  const total = subtotal - discountAmount
  const finalPrice = Math.max(total, 50) // Minimum charge
  
  // Estimated duration based on size
  const estimatedDuration = Math.max(2, bedrooms + bathrooms) // Hours
  
  return {
    basePrice,
    addOnPrice,
    discountAmount,
    total: finalPrice,
    estimatedPrice: finalPrice,
    estimatedDuration,
    savings: discountAmount > 0 ? discountAmount : undefined
  }
}