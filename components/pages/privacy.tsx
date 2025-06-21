import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react"

const sections = [
  {
    title: "Information We Collect",
    icon: FileText,
    content: [
      "Personal information you provide when creating an account (name, email, phone number)",
      "Service preferences and booking history",
      "Payment information (processed securely through third-party providers)",
      "Location data when you use our services",
      "Device information and usage analytics",
      "Communications between you and service providers",
    ],
  },
  {
    title: "How We Use Your Information",
    icon: Eye,
    content: [
      "To provide and improve our home services platform",
      "To match you with qualified service providers",
      "To process payments and manage bookings",
      "To communicate about your services and account",
      "To ensure safety and security of our platform",
      "To comply with legal obligations",
    ],
  },
  {
    title: "Information Sharing",
    icon: Users,
    content: [
      "With service providers to fulfill your bookings",
      "With payment processors to handle transactions",
      "With analytics providers to improve our services",
      "When required by law or to protect our rights",
      "In connection with business transfers or mergers",
      "With your explicit consent for other purposes",
    ],
  },
  {
    title: "Data Security",
    icon: Lock,
    content: [
      "Industry-standard encryption for data transmission",
      "Secure storage with access controls and monitoring",
      "Regular security audits and vulnerability assessments",
      "Employee training on data protection practices",
      "Incident response procedures for data breaches",
      "Compliance with applicable data protection regulations",
    ],
  },
]

export function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-blue-400" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto opacity-90">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-gray-300">Last updated: March 15, 2024</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Tapstead, Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our home services
                platform, including our website and mobile application (collectively, the "Service").
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                By using our Service, you agree to the collection and use of information in accordance with this policy.
                If you do not agree with our policies and practices, do not use our Service.
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

          {/* Your Rights */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Access and Update</h4>
                <p className="text-gray-600">
                  You can access and update your personal information through your account settings or by contacting us.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Deletion</h4>
                <p className="text-gray-600">
                  You can request deletion of your personal information, subject to certain legal and business
                  requirements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Marketing Communications</h4>
                <p className="text-gray-600">
                  You can opt out of marketing communications at any time by following the unsubscribe instructions in
                  our emails.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Location Data</h4>
                <p className="text-gray-600">
                  You can control location sharing through your device settings or app preferences.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services, comply with legal
                obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we
                will securely delete or anonymize it.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that
                such transfers comply with applicable data protection laws and implement appropriate safeguards to
                protect your information.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Our Service is not intended for children under 18 years of age. We do not knowingly collect personal
                information from children under 18. If you are a parent or guardian and believe your child has provided
                us with personal information, please contact us.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this
                Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-800">
                <Mail className="w-6 h-6 mr-3" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-blue-700">
                <p>
                  <strong>Email:</strong> privacy@tapstead.com
                </p>
                <p>
                  <strong>Phone:</strong> (555) 123-4567
                </p>
                <p>
                  <strong>Address:</strong> 123 Privacy Street, San Francisco, CA 94105
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
