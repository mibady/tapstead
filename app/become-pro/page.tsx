import { ProRecruitmentLanding } from "@/components/provider/pro-recruitment-landing"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function BecomeProPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <ProRecruitmentLanding />
      </main>
      <Footer />
    </div>
  )
}
