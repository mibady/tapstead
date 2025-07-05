'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import StripeCheckoutButton from '../stripe/StripeCheckoutButton'
import { getFrequencyLabel, getBedroomLabel } from '@/lib/booking/pricing'

interface ReviewStepProps {
  bookingData: {
    frequency: string
    bedrooms: string
    date: Date
    time: string
    contact: {
      name: string
      email: string
      phone: string
    }
    address: {
      street: string
      apt?: string
      city: string
      state: string
      zip: string
    }
  }
  onBack: () => void
  onSuccess: () => void
}

export default function ReviewStep({ bookingData, onBack, onSuccess }: ReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review and Pay</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Selected Package</h3>
            <p>Frequency: {getFrequencyLabel(bookingData.frequency)}</p>
            <p>Home Size: {getBedroomLabel(bookingData.bedrooms)}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Appointment</h3>
            <p>Date: {format(bookingData.date, 'PPP')}</p>
            <p>Time: {format(new Date(bookingData.time), 'h:mm a')}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Contact Information</h3>
            <p>{bookingData.contact.name}</p>
            <p>{bookingData.contact.email}</p>
            <p>{bookingData.contact.phone}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Service Address</h3>
            <p>
              {bookingData.address.street}
              {bookingData.address.apt && `, ${bookingData.address.apt}`}
              <br />
              {bookingData.address.city}, {bookingData.address.state} {bookingData.address.zip}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <StripeCheckoutButton
          frequency={bookingData.frequency}
          bedrooms={bookingData.bedrooms}
          date={bookingData.date}
          time={bookingData.time}
          contact={bookingData.contact}
          address={bookingData.address}
          onSuccess={onSuccess}
        />
      </CardFooter>
    </Card>
  )
}