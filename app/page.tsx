import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { EmergencyServicesSection } from "@/components/sections/emergency-services-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { TrustSection } from "@/components/sections/trust-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CTASection } from "@/components/sections/cta-section"
// Header is now included in ClientLayoutWrapper
import { Footer } from "@/components/layout/footer"
import { BookingAgent } from "@/components/agents/BookingAgent"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <ServicesSection />
        <EmergencyServicesSection />
        <HowItWorksSection />
        <TrustSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <BookingAgent />
    </div>
  )
}
