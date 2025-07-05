'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { QuoteRequestForm } from './QuoteRequestForm'

const QUOTE_STEPS = [
  { id: 1, title: 'Service Details', description: 'Choose service & details' },
  { id: 2, title: 'Your Info', description: 'Contact information' },
  { id: 3, title: 'Review', description: 'Review and submit' },
  { id: 4, title: 'Confirmation', description: 'Quote request sent!' },
]

const SERVICES = [
  'Window Cleaning',
  'Pressure Washing',
  'Gutter Cleaning',
  'Solar Panel Cleaning',
  'Christmas Light Installation',
  'Roof Cleaning'
]

export function QuoteRequestFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    service: '',
    details: null,
    contact: null,
  })
  const [error, setError] = useState<string | null>(null)

  const progress = ((currentStep - 1) / (QUOTE_STEPS.length - 1)) * 100

  const handleNext = (data: any) => {
    try {
      setError(null)
      setFormData(prev => ({ ...prev, [getCurrentStepKey()]: data }))
      if (currentStep < QUOTE_STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error('Error in quote flow:', err)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const getCurrentStepKey = () => {
    switch (currentStep) {
      case 1:
        return 'service'
      case 2:
        return 'details'
      case 3:
        return 'contact'
      default:
        return 'service'
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <div className="font-medium">Error</div>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">Request a Quote</CardTitle>
            <Badge variant="secondary">
              Step {currentStep} of {QUOTE_STEPS.length}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {QUOTE_STEPS.map((step) => (
              <div
                key={step.id}
                className={`text-center ${
                  step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs">{step.description}</div>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      <QuoteRequestForm
        services={SERVICES}
        step={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        formData={formData}
      />
    </div>
  )
}