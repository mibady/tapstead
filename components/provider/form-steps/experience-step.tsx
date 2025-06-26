import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProviderFormData } from "@/hooks/use-provider-form"

interface ExperienceStepProps {
  formData: ProviderFormData
  onInputChange: (field: string, value: any) => void
}

const EXPERIENCE_LEVELS = [
  { value: "0-1", label: "Less than 1 year" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10+", label: "More than 10 years" },
]

export function ExperienceStep({ formData, onInputChange }: ExperienceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Professional Experience</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Share your professional background and experience to help customers understand your qualifications.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name (Optional)</Label>
          <Input
            id="businessName"
            placeholder="ABC Home Services LLC"
            value={formData.businessName}
            onChange={(e) => onInputChange("businessName", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            If you operate under a business name, please provide it here.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearsExperience">Years of Experience</Label>
          <Select 
            value={formData.yearsExperience} 
            onValueChange={(value) => onInputChange("yearsExperience", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="previousWork">Previous Work & Projects</Label>
          <Textarea
            id="previousWork"
            placeholder="Describe your previous work experience, notable projects, or relevant background..."
            value={formData.previousWork}
            onChange={(e) => onInputChange("previousWork", e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Include details about your work history, types of projects completed, and any relevant achievements.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specializations">Specializations & Skills</Label>
          <Textarea
            id="specializations"
            placeholder="List your specializations, certifications, or unique skills..."
            value={formData.specializations}
            onChange={(e) => onInputChange("specializations", e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            What makes you stand out? Include any certifications, specializations, or unique skills.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="militaryVeteran"
            checked={formData.militaryVeteran}
            onCheckedChange={(checked) => onInputChange("militaryVeteran", checked)}
          />
          <Label 
            htmlFor="militaryVeteran" 
            className="text-sm font-normal cursor-pointer"
          >
            I am a U.S. military veteran
          </Label>
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Veterans receive priority consideration and additional support in our network.
        </p>
      </div>
    </div>
  )
}