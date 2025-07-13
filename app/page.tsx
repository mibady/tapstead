import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { TrustSection } from "@/components/sections/trust-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { CTASection } from "@/components/sections/cta-section"
import { MarketingLayout } from "@/components/layout/marketing-layout"

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <TrustSection />
      <PricingSection />
      <CTASection />
    </MarketingLayout>
  )
}
