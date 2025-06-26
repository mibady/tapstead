import { useState } from "react"

export interface Reference {
  name: string
  phone: string
  relationship: string
}

export interface ProviderFormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string

  // Experience
  businessName: string
  yearsExperience: string
  previousWork: string
  specializations: string
  militaryVeteran: boolean

  // Verification
  hasInsurance: boolean
  insuranceAmount: string
  hasLicense: boolean
  licenseNumber: string
  licenseState: string
  references: Reference[]

  // Services
  selectedServices: string[]
  serviceAreas: string[]
  availability: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }

  // Legal
  agreeToTerms: boolean
  agreeToBackground: boolean
}

const initialFormData: ProviderFormData = {
  // Personal Info
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",

  // Experience
  businessName: "",
  yearsExperience: "",
  previousWork: "",
  specializations: "",
  militaryVeteran: false,

  // Verification
  hasInsurance: false,
  insuranceAmount: "",
  hasLicense: false,
  licenseNumber: "",
  licenseState: "",
  references: [
    { name: "", phone: "", relationship: "" },
    { name: "", phone: "", relationship: "" },
    { name: "", phone: "", relationship: "" },
  ],

  // Services
  selectedServices: [],
  serviceAreas: [],
  availability: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },

  // Legal
  agreeToTerms: false,
  agreeToBackground: false,
}

export function useProviderForm() {
  const [formData, setFormData] = useState<ProviderFormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (section: keyof ProviderFormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }))
  }

  const handleReferenceChange = (index: number, field: keyof Reference, value: string) => {
    setFormData((prev) => {
      const newReferences = [...prev.references]
      newReferences[index] = { ...newReferences[index], [field]: value }
      return { ...prev, references: newReferences }
    })
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setCurrentStep(1)
    setError("")
    setLoading(false)
  }

  return {
    formData,
    currentStep,
    loading,
    error,
    setLoading,
    setError,
    handleInputChange,
    handleNestedChange,
    handleReferenceChange,
    handleServiceToggle,
    nextStep,
    prevStep,
    resetForm,
  }
}