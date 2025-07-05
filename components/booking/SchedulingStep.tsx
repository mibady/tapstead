'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface SchedulingStepProps {
  onNext: (data: { date: Date; time: string }) => void
  onBack: () => void
}

// Generate time slots between 8 AM and 6 PM
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 8; hour <= 18; hour++) {
    const time = new Date()
    time.setHours(hour, 0, 0, 0)
    slots.push(format(time, 'h:mm a'))
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

export default function SchedulingStep({ onNext, onBack }: SchedulingStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  useEffect(() => {
    if (selectedDate) {
      // Filter out past times if date is today
      const now = new Date()
      const isToday = format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')

      const times = TIME_SLOTS.filter(time => {
        if (!isToday) return true
        const [hours, minutes] = time.split(':')
        const slot = new Date(selectedDate)
        slot.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        return slot > now
      })

      setAvailableTimes(times)
      setSelectedTime(undefined)
    }
  }, [selectedDate])

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':')
      const dateTime = new Date(selectedDate)
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      onNext({ date: selectedDate, time: dateTime.toISOString() })
    }
  }

  const disabledDays = {
    before: new Date(),
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold">Select Date</Label>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabledDays}
                className="rounded-md border"
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Available Times</Label>
            <div className="mt-2">
              {selectedDate ? (
                <Select value={selectedTime || ''} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please select a date to see available times
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6">
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
          >
            Continue
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}