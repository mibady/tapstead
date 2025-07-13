import { LoginPageClient } from "./login-page-client"

export const metadata = {
  title: "Login | Tapstead",
  description: "Sign in to your Tapstead account to manage bookings, view service history, and access your dashboard.",
}

export default function LoginPage() {
  return <LoginPageClient />
}
