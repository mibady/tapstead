import { z } from "zod"

export const ProviderApplicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company_name: z.string().optional(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  experience_years: z.number().min(0, "Experience years must be 0 or greater"),
  license_number: z.string().optional(),
  insurance_provider: z.string().optional(),
  coverage_amount: z.number().optional(),
  service_areas: z.array(z.string()).min(1, "Please select at least one service area"),
  availability: z.object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
  }),
  emergency_services: z.boolean().default(false),
  background_check_consent: z.boolean().refine((val) => val === true, {
    message: "Background check consent is required",
  }),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Terms and conditions must be accepted",
  }),
  additional_info: z.string().optional(),
})

export type NewProviderApplication = z.infer<typeof ProviderApplicationSchema>

export const ProviderApplicationUpdateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  admin_notes: z.string().optional(),
})

export type ProviderApplicationUpdate = z.infer<typeof ProviderApplicationUpdateSchema>
