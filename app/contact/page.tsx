import { MarketingLayout } from "@/components/layout/marketing-layout"
import { ContactPage } from "@/components/pages/contact"

export const metadata = {
  title: "Contact Tapstead | Get in Touch",
  description:
    "Contact Tapstead for questions about our home services. Multiple ways to reach our customer support team.",
}

export default function Contact() {
  return (
    <MarketingLayout>
      <ContactPage />
    </MarketingLayout>
  )
}
