import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Shield, Users, CreditCard, AlertTriangle, Scale } from "lucide-react"

const sections = [
  {
    title: "Acceptance of Terms",
    icon: FileText,
    content: [
      "By accessing or using Tapstead's services, you agree to be bound by these Terms of Service",
      "If you do not agree to these terms, you may not use our services",
      "We may modify these terms at any time with notice to users",
      "Continued use after changes constitutes acceptance of new terms",
    ],
  },
  {
    title: "Service Description",
    icon: Shield,
    content: [
      "Tapstead is a platform connecting customers with home service providers",
      "We facilitate bookings but do not directly provide home services",
      "Service providers are independent contractors, not Tapstead employees",
      "We strive to maintain quality standards but cannot guarantee service outcomes",
    ],
  },
  {
    title: "User Responsibilities",
    icon: Users,
    content: [
      "Provide accurate and complete information when creating your account",
      "Maintain the security of your account credentials",
      "Use the platform only for lawful purposes",
      "Treat service providers and other users with respect",
      "Pay for services as agreed and on time",
      "Report any issues or concerns promptly",
    ],
  },
  {
    title: "Payment Terms",
    icon: CreditCard,
    content: [
      "Payment is due upon completion of services unless otherwise agreed",
      "We use secure third-party payment processors",
      "You authorize us to charge your payment method for services booked",
      "Refunds are subject to our refund policy and service provider terms",
      "You are responsible for any taxes applicable to your transactions",
    ],
  },
  {
    title: "Limitation of Liability",
    icon: AlertTriangle,
    content: [
      "Tapstead's liability is limited to the maximum extent permitted by law",
      "We are not liable for damages arising from service provider actions",
      "Our total liability shall not exceed the amount paid for the specific service",
      "We disclaim warranties regarding service quality or outcomes",
      "Users assume risk when engaging service providers through our platform",
    ],
  },
]

export function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Scale className="w-16 h-16 mx-auto mb-6 text-blue-400" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto opacity-90">
            Please read these terms carefully before using our home services platform.
          </p>
          <p className="text-gray-300">Last updated: March 15, 2024</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Agreement Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service ("Terms") govern your use of Tapstead's home services platform, including our
                website, mobile application, and related services (collectively, the "Service"). These Terms constitute
                a legally binding agreement between you and Tapstead, Inc. ("Tapstead," "we," "our," or "us").
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Please read these Terms carefully. By using our Service, you acknowledge that you have read, understood,
                and agree to be bound by these Terms and our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <section.icon className="w-6 h-6 mr-3 text-blue-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Provider Terms */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Service Provider Relationship</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Independent Contractors</h4>
                <p className="text-gray-600">
                  Service providers on our platform are independent contractors, not employees or agents of Tapstead.
                  They set their own schedules, methods, and pricing within our platform guidelines.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quality Standards</h4>
                <p className="text-gray-600">
                  While we maintain quality standards and review processes, we cannot guarantee the quality or outcome
                  of services provided by independent contractors.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Disputes</h4>
                <p className="text-gray-600">
                  Disputes between customers and service providers should first be resolved directly. Tapstead may
                  assist in resolution but is not liable for service provider actions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">You may not use our Service to:</p>
              <ul className="space-y-2">
                {[
                  "Violate any applicable laws or regulations",
                  "Harass, abuse, or harm other users or service providers",
                  "Post false, misleading, or fraudulent information",
                  "Attempt to circumvent our payment systems",
                  "Use automated systems to access our platform without permission",
                  "Interfere with the proper functioning of our Service",
                  "Infringe on intellectual property rights",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Cancellation and Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Cancellations</h4>
                <p className="text-gray-600">
                  You may cancel bookings according to our cancellation policy. Cancellation fees may apply depending on
                  timing and service type.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service Provider Cancellations</h4>
                <p className="text-gray-600">
                  If a service provider cancels, we will help you find a replacement or provide a full refund.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Refunds</h4>
                <p className="text-gray-600">
                  Refunds are processed according to our refund policy and may take 3-5 business days to appear in your
                  account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                The Service and its original content, features, and functionality are owned by Tapstead and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property
                laws. You may not reproduce, distribute, modify, or create derivative works of our content without
                explicit permission.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice,
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              <p className="text-gray-600 leading-relaxed">
                You may terminate your account at any time by contacting us. Upon termination, your right to use the
                Service will cease immediately.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Governing Law and Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Governing Law</h4>
                <p className="text-gray-600">
                  These Terms are governed by the laws of the State of California, without regard to conflict of law
                  principles.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dispute Resolution</h4>
                <p className="text-gray-600">
                  Any disputes arising from these Terms or your use of the Service will be resolved through binding
                  arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-800">
                <FileText className="w-6 h-6 mr-3" />
                Questions About These Terms?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-blue-700">
                <p>
                  <strong>Email:</strong> legal@tapstead.com
                </p>
                <p>
                  <strong>Phone:</strong> (555) 123-4567
                </p>
                <p>
                  <strong>Address:</strong> 123 Legal Street, San Francisco, CA 94105
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
