import { MarketingLayout } from "@/components/layout/marketing-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Application Submitted | Tapstead Pro Network",
  description: "Your application has been successfully submitted. We'll review it and get back to you soon.",
}

export default function ApplicationSuccessPage() {
  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Application Submitted!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-gray-600">
                  Thank you for your interest in joining the Tapstead professional network. We've received your
                  application and will review it carefully.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      We'll review your application within 2-3 business days
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Our team will contact you for a brief phone interview
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      If approved, we'll schedule your onboarding session
                    </li>
                  </ul>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-500">
                    Questions about your application? Contact us at{" "}
                    <a href="mailto:pros@tapstead.com" className="text-blue-600 hover:underline">
                      pros@tapstead.com
                    </a>
                  </p>

                  <div className="flex gap-4 justify-center">
                    <Button asChild variant="outline">
                      <Link href="/">Return Home</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/become-pro">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
