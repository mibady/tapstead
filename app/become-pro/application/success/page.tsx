import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Mail, Phone, FileText } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
              <p className="text-xl text-gray-600 mb-4">
                Thank you for your interest in becoming a Tapstead Certified Pro
              </p>
              <Badge className="bg-green-600 text-lg px-4 py-2">
                Application #TS-{Date.now().toString().slice(-6)}
              </Badge>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Application Review</h4>
                      <p className="text-gray-600 text-sm">Our team will review your application within 48 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Background Check & Verification</h4>
                      <p className="text-gray-600 text-sm">
                        We'll verify your references, insurance, and run background checks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Onboarding & Training</h4>
                      <p className="text-gray-600 text-sm">
                        Complete our certification training and get access to the Pro app
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Start Earning</h4>
                      <p className="text-gray-600 text-sm">Begin receiving pre-booked, pre-paid jobs in your area</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Check Your Email</h4>
                    <p className="text-gray-600 text-sm">
                      We've sent a confirmation email with your application details and next steps
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Prepare Your Documents</h4>
                    <p className="text-gray-600 text-sm">
                      Have your insurance certificate, licenses, and references ready for verification
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Questions?</h4>
                    <p className="text-gray-600 text-sm">
                      Call our Pro Recruitment Team at (555) PRO-JOBS or email pros@tapstead.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/">Return to Homepage</Link>
              </Button>
              <div className="text-sm text-gray-500">Application submitted on {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
