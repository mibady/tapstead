export interface ServiceCategory {
  id: string
  name: string
  baseRate: string
}

export const serviceCategories: ServiceCategory[] = [
  { id: "cleaning", name: "House Cleaning", baseRate: "$25-35/hr" },
  { id: "handyman", name: "Handyman Services", baseRate: "$35-50/hr" },
  { id: "plumbing", name: "Plumbing", baseRate: "$75-125/hr" },
  { id: "electrical", name: "Electrical", baseRate: "$85-150/hr" },
  { id: "painting", name: "Painting", baseRate: "$30-45/hr" },
  { id: "junk-removal", name: "Junk Removal", baseRate: "$40-60/hr" },
  { id: "pressure-washing", name: "Pressure Washing", baseRate: "$35-55/hr" },
  { id: "gutter-services", name: "Gutter Services", baseRate: "$40-65/hr" },
  { id: "welding", name: "Welding Services", baseRate: "$65-95/hr" },
  { id: "fire-debris", name: "Fire Debris Removal", baseRate: "$45-75/hr" },
]

export interface FormStep {
  id: number
  title: string
  icon: any
  description: string
}

export const formSteps: FormStep[] = [
  { id: 1, title: "Personal Info", icon: "User", description: "Basic information" },
  { id: 2, title: "Experience", icon: "Briefcase", description: "Professional background" },
  { id: 3, title: "Verification", icon: "Shield", description: "Documents & references" },
  { id: 4, title: "Services", icon: "FileText", description: "What you offer" },
  { id: 5, title: "Review", icon: "CheckCircle", description: "Submit application" },
]