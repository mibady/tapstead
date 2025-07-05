import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const bookingData = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_CALCOM_API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CALCOM_API_KEY}`,
      },
      body: JSON.stringify({
        ...bookingData,
        eventTypeId: 1,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create booking')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}