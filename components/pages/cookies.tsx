import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cookie, Settings, BarChart, Shield, Users } from "lucide-react"

const cookieTypes = [
  {
    title: "Essential Cookies",
    icon: Shield,
    badge: "Always Active",
    badgeVariant: "default" as const,
    description: "These cookies are necessary for the website to function and cannot be switched off.",
    examples: [
      "Authentication and login status",
      "Shopping cart contents",
      "Security and fraud prevention",
      "Load balancing and performance",
    ],
  },
  {
    title: "Analytics Cookies",
    icon: BarChart,
    badge: "Optional",
    badgeVariant: "secondary" as const,
    description: "These cookies help us understand how visitors interact with our website.",
    examples: [
      "Page views and user journeys",
      "Time spent on pages",
      "Click tracking and heatmaps",
      "Error reporting and debugging",
    ],
  },
  {
    title: "Functional Cookies",
    icon: Settings,
    badge: "Optional",
    badgeVariant: "secondary" as const,
    description: "These cookies enable enhanced functionality and personalization.",
    examples: [
      "Language and region preferences",
      "Accessibility settings",
      "Customized user interface",
      "Remember form inputs",
    ],
  },
  {
    title: "Marketing Cookies",
    icon: Users,
    badge: "Optional",
    badgeVariant: "secondary" as const,
    description: "These cookies are used to deliver relevant advertisements and track campaign effectiveness.",
    examples: [
      "Targeted advertising",
      "Social media integration",
      "Campaign performance tracking",
      "Cross-site behavioral tracking",
    ],
  },
]

const thirdPartyServices = [
  {
    name: "Google Analytics",
    purpose: "Website analytics and user behavior tracking",
    type: "Analytics",
    retention: "26 months",
  },
  {
    name: "Stripe",
    purpose: "Payment processing and fraud prevention",
    type: "Essential",
    retention: "Session",
  },
  {
    name: "Intercom",
    purpose: "Customer support and live chat",
    type: "Functional",
    retention: "12 months",
  },
  {
    name: "Facebook Pixel",
    purpose: "Social media advertising and tracking",
    type: "Marketing",
    retention: "90 days",
  },
  {
    name: "Hotjar",
    purpose: "User experience analysis and heatmaps",
    type: "Analytics",
    retention: "12 months",
  },
]

export function CookiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Cookie className="w-16 h-16 mx-auto mb-6 text-blue-400" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto opacity-90">
            Learn about how we use cookies and similar technologies to improve your experience.
          </p>
          <p className="text-gray-300">Last updated: March 15, 2024</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. They help us
                provide you with a better experience by remembering your preferences, keeping you logged in, and
                understanding how you use our platform.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                We use both first-party cookies (set by Tapstead) and third-party cookies (set by our partners) to
                enhance functionality, analyze usage, and deliver personalized content and advertisements.
              </p>
            </CardContent>
          </Card>

          {/* Cookie Types */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">Types of Cookies We Use</h2>
            {cookieTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl">
                      <type.icon className="w-6 h-6 mr-3 text-blue-600" />
                      {type.title}
                    </CardTitle>
                    <Badge variant={type.badgeVariant}>{type.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Examples:</h4>
                    <ul className="space-y-2">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Third-Party Services */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                We work with trusted third-party services that may set their own cookies. Here are the main services we
                use:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Service</th>
                      <th className="text-left p-3 font-semibold">Purpose</th>
                      <th className="text-left p-3 font-semibold">Type</th>
                      <th className="text-left p-3 font-semibold">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thirdPartyServices.map((service, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{service.name}</td>
                        <td className="p-3 text-gray-600">{service.purpose}</td>
                        <td className="p-3">
                          <Badge variant="outline">{service.type}</Badge>
                        </td>
                        <td className="p-3 text-gray-600">{service.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Browser Settings</h4>
                <p className="text-gray-600">
                  You can control cookies through your browser settings. Most browsers allow you to block or delete
                  cookies, though this may affect website functionality.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cookie Consent Manager</h4>
                <p className="text-gray-600 mb-3">
                  Use our cookie consent manager to customize your preferences for optional cookies.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Cookie Preferences
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Opt-Out Links</h4>
                <p className="text-gray-600">
                  You can opt out of certain third-party tracking through industry opt-out pages:
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <a href="http://optout.aboutads.info/" className="text-blue-600 hover:underline">
                      Digital Advertising Alliance Opt-Out
                    </a>
                  </li>
                  <li>
                    <a href="http://optout.networkadvertising.org/" className="text-blue-600 hover:underline">
                      Network Advertising Initiative Opt-Out
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Retention */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Cookie Retention Periods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Session Cookies</h4>
                  <p className="text-gray-600">
                    Deleted when you close your browser. Used for essential functions like maintaining your login
                    status.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                  <p className="text-gray-600">
                    Remain on your device for a set period (ranging from days to years) or until you delete them
                    manually.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable
                laws. We will notify you of any material changes by posting the updated policy on our website and
                updating the "Last updated" date above.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-800">
                <Cookie className="w-6 h-6 mr-3" />
                Questions About Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
