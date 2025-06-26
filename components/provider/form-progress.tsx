import React from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { User, Briefcase, Shield, FileText, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormStep {
  id: number
  title: string
  description: string
  icon: any
}

const steps: FormStep[] = [
  { id: 1, title: "Personal Info", icon: User, description: "Basic information" },
  { id: 2, title: "Experience", icon: Briefcase, description: "Professional background" },
  { id: 3, title: "Verification", icon: Shield, description: "Documents & references" },
  { id: 4, title: "Services", icon: FileText, description: "What you offer" },
  { id: 5, title: "Review", icon: CheckCircle, description: "Submit application" },
]

interface FormProgressProps {
  currentStep: number
}

export function FormProgress({ currentStep }: FormProgressProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="hidden md:flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          const isUpcoming = step.id > currentStep

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center text-center space-y-2 flex-1",
                index !== steps.length - 1 && "relative"
              )}
            >
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 z-0",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                  style={{ left: "calc(50% + 1.5rem)" }}
                />
              )}

              {/* Step Icon */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isUpcoming && "border-muted bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Step Info */}
              <div className="space-y-1">
                <h4
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive && "text-primary",
                    isCompleted && "text-primary",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2",
              "border-primary bg-primary text-primary-foreground"
            )}
          >
            {steps.find(s => s.id === currentStep)?.icon && (
              React.createElement(steps.find(s => s.id === currentStep)!.icon, { className: "w-5 h-5" })
            )}
          </div>
          <div>
            <h4 className="font-medium">
              {steps.find(s => s.id === currentStep)?.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {steps.find(s => s.id === currentStep)?.description}
            </p>
          </div>
          <Badge variant="secondary">
            {currentStep}/{steps.length}
          </Badge>
        </div>
      </div>
    </div>
  )
}