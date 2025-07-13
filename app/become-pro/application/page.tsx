import { MarketingLayout } from "@/components/layout/marketing-layout"
import { ProApplicationForm } from "@/components/provider/pro-application-form"

export const metadata = {
  title: "Pro Application | Join Tapstead Network",
  description:
    "Apply to become a Tapstead professional service provider. Complete our application to join our trusted network of home service experts.",
}

export default function ProApplicationPage() {
  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Join the Tapstead Network</h1>
              <p className="text-lg text-gray-600">
                Complete your application to become a trusted Tapstead professional
              </p>
            </div>
            <ProApplicationForm />
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
