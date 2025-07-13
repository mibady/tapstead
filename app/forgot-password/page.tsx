import { ForgotPasswordPageClient } from "./forgot-password-page-client"

export const metadata = {
  title: "Forgot Password | Tapstead",
  description: "Reset your Tapstead account password. Enter your email to receive password reset instructions.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />
}
