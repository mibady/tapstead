import { ProApplicationForm } from "@/components/provider/pro-application-form"
// Header is now included in ClientLayoutWrapper
import { Footer } from "@/components/layout/footer"

export default function ProApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <ProApplicationForm />
      </main>
      <Footer />
    </div>
  )
}
