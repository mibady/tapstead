import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const {
      serviceId,
      serviceName,
      projectDescription,
      urgency,
      budget,
      propertyType,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      preferredContactMethod,
      preferredTime,
      availableWeekdays,
      availableWeekends,
      specialRequests,
      submittedAt
    } = req.body

    // Validate required fields
    if (!serviceId || !projectDescription || !firstName || !lastName || !email || !phone || !address) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // For now, just log the quote request (replace with database insert later)
    console.log('Quote Request Received:', {
      serviceId,
      serviceName,
      customer: `${firstName} ${lastName}`,
      email,
      phone,
      address: `${address}, ${city}, ${state} ${zipCode}`,
      projectDescription,
      urgency,
      budget,
      propertyType,
      preferredContactMethod,
      preferredTime,
      availableWeekdays,
      availableWeekends,
      specialRequests
    })

    // TODO: Insert into database table 'quote_requests'
    // TODO: Send notification email to team
    // TODO: Send confirmation email to customer
    // TODO: Add to CRM/project management system

    res.status(200).json({ 
      success: true, 
      message: 'Quote request submitted successfully',
      estimatedResponse: '2 hours'
    })

  } catch (error) {
    console.error('Error processing quote request:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
