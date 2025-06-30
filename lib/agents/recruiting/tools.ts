import { tool } from 'ai'
import { z } from 'zod'
import { getAllServices } from '@/lib/services/service-data'
import { submitProviderApplication } from '@/lib/actions/provider-actions'
import { ProviderApplicationSchema } from '@/lib/validations/provider-application'
import { logToolExecution } from '../core/logging'

export const searchRecruitingFAQ = tool({
  description: 'Searches the recruiting FAQ to answer questions about working with Tapstead',
  parameters: z.object({
    query: z.string().describe('The question or topic to search for')
  }),
  async execute({ query }) {
    await logToolExecution('recruiting', 'search_recruiting_faq')
    
    // Comprehensive FAQ data
    const faqData = {
      payment: {
        question: "How do I get paid?",
        answer: "You get paid weekly via direct deposit. We handle all payment processing and customer billing. You'll receive 70-80% of the service fee depending on your service category and performance rating."
      },
      services: {
        question: "What services can I offer?",
        answer: "We offer house cleaning, handyman services, plumbing, electrical work, painting, pressure washing, gutter services, junk removal, welding, and emergency services. You can apply for multiple service categories."
      },
      requirements: {
        question: "What are the requirements to join?",
        answer: "You must have relevant experience, your own tools and transportation, liability insurance (minimum $1M), pass a background check, and be available in our service areas."
      },
      insurance: {
        question: "Do I need insurance?",
        answer: "Yes, general liability insurance with minimum $1M coverage is required. We can help connect you with affordable insurance providers if needed."
      },
      background_check: {
        question: "What does the background check include?",
        answer: "We conduct criminal background checks and verify your identity. Some service categories may require additional certifications or license verification."
      },
      service_areas: {
        question: "Where do you serve?",
        answer: "We currently serve the greater metropolitan area with plans to expand. During application, you'll specify which zip codes you can serve."
      },
      work_schedule: {
        question: "Can I set my own schedule?",
        answer: "Yes! You control your availability. You can set your working days and hours in your provider dashboard and update them anytime."
      },
      support: {
        question: "What support do you provide?",
        answer: "We provide customer acquisition, payment processing, scheduling system, customer support, and business tools. You focus on delivering great service."
      },
      emergency_services: {
        question: "What are emergency services?",
        answer: "Emergency services include urgent repairs, disaster cleanup, storm damage, and fire debris removal. These typically pay higher rates but require 24/7 availability."
      }
    }

    const queryLower = query.toLowerCase()
    const relevantEntries = Object.entries(faqData).filter(([key, value]) => 
      key.includes(queryLower) || 
      value.question.toLowerCase().includes(queryLower) ||
      value.answer.toLowerCase().includes(queryLower)
    )

    if (relevantEntries.length === 0) {
      return {
        found: false,
        message: "I don't have specific information about that topic. Let me connect you with our team for more details."
      }
    }

    return {
      found: true,
      results: relevantEntries.map(([key, value]) => ({
        topic: key,
        question: value.question,
        answer: value.answer
      }))
    }
  }
})

export const getAvailableServices = tool({
  description: 'Gets the list of services available for providers to offer',
  parameters: z.object({}),
  async execute() {
    await logToolExecution('recruiting', 'get_available_services')
    
    try {
      const services = await getAllServices()
      return {
        success: true,
        services: services.map(service => ({
          id: service.id,
          title: service.title,
          category: service.category,
          description: service.description
        }))
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to fetch services at the moment"
      }
    }
  }
})

export const startProviderApplication = tool({
  description: 'Initiates a new provider application with basic information',
  parameters: z.object({
    name: z.string().describe('Full name of the applicant'),
    email: z.string().email().describe('Email address'),
    phone: z.string().describe('Phone number'),
    services: z.array(z.string()).describe('Array of service categories they want to offer'),
    experience_years: z.number().describe('Years of experience in their field'),
    service_areas: z.array(z.string()).describe('Zip codes or areas they can serve')
  }),
  async execute({ name, email, phone, services, experience_years, service_areas }) {
    await logToolExecution('recruiting', 'start_provider_application')
    
    try {
      // Create a basic application with required fields
      const applicationData = {
        name,
        email,
        phone,
        services,
        experience_years,
        service_areas,
        company_name: '',
        license_number: '',
        insurance_provider: '',
        coverage_amount: 0,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
        emergency_services: false,
        background_check_consent: true,
        terms_accepted: true,
        additional_info: 'Application started via AI assistant'
      }

      const result = await submitProviderApplication(applicationData)
      
      if (result.success) {
        return {
          success: true,
          message: "Great! I've started your application. You'll receive an email with next steps to complete your profile, upload required documents, and verify your information."
        }
      } else {
        return {
          success: false,
          message: "There was an issue starting your application. Please try again or contact our support team."
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Unable to process your application right now. Please try again later."
      }
    }
  }
})

export const checkApplicationStatus = tool({
  description: 'Checks the status of an existing provider application',
  parameters: z.object({
    email: z.string().email().describe('Email address used for the application')
  }),
  async execute({ email }) {
    await logToolExecution('recruiting', 'check_application_status')
    
    // In a real implementation, you'd query your database
    // For now, return a helpful message
    return {
      message: "To check your application status, please log into your account or contact our support team. We typically review applications within 2-3 business days."
    }
  }
})

export const getOnboardingSteps = tool({
  description: 'Provides the next steps in the provider onboarding process',
  parameters: z.object({
    stage: z.string().optional().describe('Current stage of onboarding')
  }),
  async execute({ stage }) {
    await logToolExecution('recruiting', 'get_onboarding_steps')
    
    const onboardingSteps = {
      initial: [
        "Complete your provider application",
        "Upload proof of insurance (minimum $1M liability)",
        "Submit relevant licenses or certifications",
        "Pass background check verification"
      ],
      documents: [
        "Upload a clear photo of your driver's license",
        "Provide certificate of insurance",
        "Submit business license (if applicable)",
        "Upload photos of your work samples"
      ],
      approval: [
        "Complete phone interview with our team",
        "Set up your service areas and availability",
        "Complete platform training modules",
        "Activate your provider profile"
      ]
    }

    return {
      steps: onboardingSteps.initial,
      message: "Here are the key steps to become a Tapstead provider. Once you complete your application, we'll guide you through each step."
    }
  }
})