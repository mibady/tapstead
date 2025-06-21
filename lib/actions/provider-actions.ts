import { sendProviderApplicationNotification, sendProviderWelcomeEmail } from "@/lib/services/resend-service"
import { db } from "@/lib/db"
import { type NewProviderApplication, ProviderApplicationSchema } from "@/lib/validations/provider-application"
import { z } from "zod"

export async function submitProviderApplication(data: NewProviderApplication) {
  try {
    const applicationData: NewProviderApplication = ProviderApplicationSchema.parse(data)

    await db.providerApplication.create({
      data: applicationData,
    })

    // Send notification to admin
    await sendProviderApplicationNotification(applicationData)

    return {
      success: true,
      message: "Application submitted successfully.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error. Please check your inputs.",
        errors: error.errors,
      }
    }
    return {
      success: false,
      message: "Failed to submit application.",
    }
  }
}

export async function approveProviderApplication(id: string) {
  try {
    const applicationData = await db.providerApplication.findUnique({
      where: {
        id: id,
      },
    })

    if (!applicationData) {
      return {
        success: false,
        message: "Application not found.",
      }
    }

    await db.provider.create({
      data: {
        email: applicationData.email,
        name: applicationData.name,
        phone: applicationData.phone,
      },
    })

    await db.providerApplication.update({
      where: {
        id: id,
      },
      data: {
        status: "APPROVED",
      },
    })

    // Send welcome email to approved provider
    await sendProviderWelcomeEmail(applicationData.email, applicationData)

    return {
      success: true,
      message: "Application approved successfully.",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to approve application.",
    }
  }
}

export async function rejectProviderApplication(id: string) {
  try {
    await db.providerApplication.update({
      where: {
        id: id,
      },
      data: {
        status: "REJECTED",
      },
    })

    return {
      success: true,
      message: "Application rejected successfully.",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to reject application.",
    }
  }
}

export async function getProviderApplications() {
  try {
    const applications = await db.providerApplication.findMany()

    return {
      success: true,
      data: applications,
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch applications.",
      data: [],
    }
  }
}

export async function updateApplicationStatus(id: string, status: "APPROVED" | "REJECTED", adminNotes?: string) {
  try {
    if (status === "APPROVED") {
      return await approveProviderApplication(id)
    } else if (status === "REJECTED") {
      return await rejectProviderApplication(id)
    }

    // For other status updates
    await db.providerApplication.update({
      where: { id },
      data: {
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      },
    })

    return {
      success: true,
      message: `Application ${status.toLowerCase()} successfully.`,
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to ${status.toLowerCase()} application.`,
    }
  }
}
