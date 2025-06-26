import { ProRecruitmentLanding } from "@/components/provider/pro-recruitment-landing"
// Header is now included in ClientLayoutWrapper
import { Footer } from "@/components/layout/footer"

export default function BecomeProPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <ProRecruitmentLanding />
      </main>
      <Footer />
    </div>
  )
}
