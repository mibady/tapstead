import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { date } = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_CALCOM_API_URL}/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CALCOM_API_KEY}`,
      },
      body: JSON.stringify({
        startTime: new Date(date).toISOString(),
        endTime: new Date(new Date(date).setHours(23, 59, 59)).toISOString(),
        eventTypeId: 1,
        duration: 60,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch availability')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}