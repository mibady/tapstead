'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BedroomType, FrequencyType, CleaningType } from '@/lib/booking/types'
import { calculatePrice, PRICING } from '@/lib/booking/pricing'

interface PackageOption {
  type: FrequencyType
  label: string
  description: string
  savings?: string
}

const PACKAGE_OPTIONS: PackageOption[] = [
  {
    type: 'oneTime',
    label: 'One-Time Cleaning',
    description: 'Premium cleaning service for a single visit'
  },
  {
    type: 'weekly',
    label: 'Weekly Service',
    description: 'Best value for regular maintenance',
    savings: 'Save up to 33%'
  },
  {
    type: 'biWeekly',
    label: 'Bi-Weekly Service',
    description: 'Most popular choice for busy homes',
    savings: 'Save up to 27%'
  },
  {
    type: 'monthly',
    label: 'Monthly Service',
    description: 'Regular maintenance cleaning',
    savings: 'Save up to 20%'
  }
]

const BEDROOM_OPTIONS: { type: BedroomType; label: string; description: string }[] = [
  {
    type: '1-2',
    label: '1-2 Bedrooms',
    description: '2-3 hours'
  },
  {
    type: '3-4',
    label: '3-4 Bedrooms',
    description: '3-4 hours'
  },
  {
    type: '5+',
    label: '5+ Bedrooms',
    description: '4-5 hours'
  }
]

const BASE_PRICING = {
  oneTime: {
    '1-2': 149,
    '3-4': 199,
    '5+': 299
  },
  weekly: {
    '1-2': 99,
    '3-4': 149,
    '5+': 199
  },
  biWeekly: {
    '1-2': 109,
    '3-4': 159,
    '5+': 219
  },
  monthly: {
    '1-2': 119,
    '3-4': 169,
    '5+': 239
  }
}

const MONTHLY_TOTALS = {
  weekly: {
    '1-2': 396,
    '3-4': 596,
    '5+': 796
  },
  biWeekly: {
    '1-2': 218,
    '3-4': 318,
    '5+': 438
  },
  monthly: {
    '1-2': 119,
    '3-4': 169,
    '5+': 239
  }
}

interface CleaningPackageSelectorProps {
  onSelect: (data: { frequency: FrequencyType; bedrooms: BedroomType; cleaningType: CleaningType }) => void
}

export default function CleaningPackageSelector({ onSelect }: CleaningPackageSelectorProps) {
  const [frequency, setFrequency] = useState<FrequencyType>('oneTime')
  const [bedrooms, setBedrooms] = useState<BedroomType>('1-2')
  const [cleaningType, setCleaningType] = useState<CleaningType>('standard')

  const handleContinue = () => {
    onSelect({ frequency, bedrooms, cleaningType })
  }

  const getMonthlyTotal = (freq: FrequencyType, beds: BedroomType) => {
    if (freq === 'oneTime') return null
    return MONTHLY_TOTALS[freq][beds]
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Select Your Cleaning Package</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Service Frequency</h3>
          <RadioGroup
            value={frequency}
            onValueChange={(value: FrequencyType) => setFrequency(value)}
            className="grid gap-4"
          >
            {PACKAGE_OPTIONS.map((option) => {
              const price = PRICING[option.type][bedrooms].price
              const monthlyTotal = getMonthlyTotal(option.type, bedrooms)
              
              return (
                <div key={option.type} className="relative">
                  <RadioGroupItem
                    value={option.type}
                    id={`frequency-${option.type}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`frequency-${option.type}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                      {option.savings && (
                        <div className="text-sm font-medium text-green-600">{option.savings}</div>
                      )}
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <div className="font-semibold">${price}/clean</div>
                      {monthlyTotal && (
                        <div className="text-sm text-muted-foreground">${monthlyTotal}/month</div>
                      )}
                    </div>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Services</h3>
          <RadioGroup
            value={cleaningType}
            onValueChange={(value: CleaningType) => setCleaningType(value)}
            className="grid gap-4"
          >
            <div className="relative">
              <RadioGroupItem
                value="standard"
                id="cleaning-standard"
                className="peer sr-only"
              />
              <Label
                htmlFor="cleaning-standard"
                className="flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="font-semibold">Standard Cleaning</div>
                  <div className="text-sm text-muted-foreground">Regular maintenance cleaning service</div>
                </div>
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem
                value="deep"
                id="cleaning-deep"
                className="peer sr-only"
              />
              <Label
                htmlFor="cleaning-deep"
                className="flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="font-semibold">Deep Clean</div>
                  <div className="text-sm text-muted-foreground">Thorough deep cleaning service</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">+$75</div>
                </div>
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem
                value="moveInOut"
                id="cleaning-move"
                className="peer sr-only"
              />
              <Label
                htmlFor="cleaning-move"
                className="flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="font-semibold">Move In/Out Clean</div>
                  <div className="text-sm text-muted-foreground">Comprehensive cleaning for moving</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">+$99</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Home Size</h3>
          <RadioGroup
            value={bedrooms}
            onValueChange={(value: BedroomType) => setBedrooms(value)}
            className="grid gap-4"
          >
            {BEDROOM_OPTIONS.map((option) => (
              <div key={option.type} className="relative">
                <RadioGroupItem
                  value={option.type}
                  id={`bedrooms-${option.type}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`bedrooms-${option.type}`}
                  className="flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-muted-foreground">Estimated time: {option.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="pt-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-lg font-semibold">Selected Package Summary</div>
            <div className="mt-2">
              <div className="flex justify-between">
                <span>Price per cleaning:</span>
                <span className="font-semibold">
                  ${calculatePrice({ frequency, bedrooms, cleaningType }).total}
                </span>
              </div>
              {frequency !== 'oneTime' && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Monthly total:</span>
                  <span>${getMonthlyTotal(frequency, bedrooms)}</span>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleContinue} className="w-full">Continue to Schedule</Button>
        </div>
      </CardContent>
    </Card>
  )
}