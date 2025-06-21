import { ProApplicationForm } from "@/components/provider/pro-application-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ProApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <ProApplicationForm />
      </main>
      <Footer />
    </div>
  )
}
