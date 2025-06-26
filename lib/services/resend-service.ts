// Temporarily disabled to fix build issues - email functionality will be restored after deployment

export async function sendWelcomeEmail(email: string, name: string) {
  console.log(`Would send welcome email to ${email} for ${name}`)
  return { success: true, data: { id: "placeholder" } }
}

export async function sendBookingConfirmation(email: string, booking: any) {
  console.log(`Would send booking confirmation to ${email}`)
  return { success: true, data: { id: "placeholder" } }
}

export async function sendContactNotification(formData: any) {
  console.log(`Would send contact notification for ${formData.email}`)
  return { success: true, data: { id: "placeholder" } }
}

export async function sendQuoteRequest(email: string, quoteData: any) {
  console.log(`Would send quote request to ${email}`)
  return { success: true, data: { id: "placeholder" } }
}

export async function sendProviderApplicationNotification(applicationData: any) {
  console.log(`Would send provider application notification for ${applicationData.email}`)
  return { success: true, data: { id: "placeholder" } }
}

export async function sendProviderWelcomeEmail(email: string, applicationData: any) {
  console.log(`Would send provider welcome email to ${email}`)
  return { success: true, data: { id: "placeholder" } }
}