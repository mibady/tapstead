import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  User,
  CreditCard,
  Settings,
  AlertTriangle,
  CheckCircle,
  BookOpen,
} from "lucide-react"

const faqCategories = [
  {
    title: "Getting Started",
    icon: User,
    count: 8,
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "You can create an account by clicking 'Sign Up' and providing your email, phone number, and basic information.",
      },
      {
        question: "Is Tapstead available in my area?",
        answer:
          "We currently serve 50+ cities across the US. Enter your zip code on our homepage to check availability.",
      },
      {
        question: "How do I book a service?",
        answer:
          "Simply select your service, choose your preferred date and time, provide details, and confirm your booking.",
      },
    ],
  },
  {
    title: "Bookings & Services",
    icon: BookOpen,
    count: 12,
    questions: [
      {
        question: "Can I reschedule my appointment?",
        answer:
          "Yes, you can reschedule up to 24 hours before your appointment through your dashboard or by contacting support.",
      },
      {
        question: "What if I need to cancel my booking?",
        answer: "You can cancel bookings through your account. Cancellation fees may apply depending on timing.",
      },
      {
        question: "How do I track my service provider?",
        answer:
          "You'll receive real-time updates and can track your provider's location through our app once they're on their way.",
      },
    ],
  },
  {
    title: "Payments & Billing",
    icon: CreditCard,
    count: 10,
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and digital wallets like Apple Pay and Google Pay.",
      },
      {
        question: "When am I charged for services?",
        answer: "Payment is processed after service completion. You'll receive a receipt via email.",
      },
      {
        question: "How do refunds work?",
        answer:
          "Refunds are processed according to our refund policy and typically take 3-5 business days to appear in your account.",
      },
    ],
  },
  {
    title: "Account & Settings",
    icon: Settings,
    count: 6,
    questions: [
      {
        question: "How do I update my profile information?",
        answer: "Go to your account settings to update your personal information, contact details, and preferences.",
      },
      {
        question: "Can I save multiple addresses?",
        answer: "Yes, you can save multiple service addresses in your account for quick booking.",
      },
      {
        question: "How do I change my password?",
        answer: "You can change your password in account settings or use the 'Forgot Password' link on the login page.",
      },
    ],
  },
]

const contactOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    availability: "24/7",
    action: "Start Chat",
    primary: true,
  },
  {
    title: "Phone Support",
    description: "Speak directly with a support specialist",
    icon: Phone,
    availability: "Mon-Fri 8AM-8PM",
    action: "Call (360) 641-7386",
    primary: false,
  },
  {
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    availability: "Response within 24 hours",
    action: "Send Email",
    primary: false,
  },
]

const emergencyInfo = {
  title: "Emergency Services",
  description: "For urgent home emergencies requiring immediate attention",
  phone: "(360) 641-7386",
  available: "24/7/365",
}

export function SupportPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">How Can We Help?</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Find answers to common questions or get in touch with our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Input
              placeholder="Search for help articles..."
              className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-white/70"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 hover:bg-gray-100">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Alert */}
      <section className="bg-red-50 border-b border-red-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Emergency Services Available 24/7:</span>
            <a href={`tel:${emergencyInfo.phone}`} className="font-bold hover:underline">
              {emergencyInfo.phone}
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Contact Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Get Support</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactOptions.map((option, index) => (
              <Card
                key={index}
                className={`text-center hover:shadow-lg transition-shadow ${option.primary ? "border-blue-500 border-2" : ""}`}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4 ${option.primary ? "bg-blue-600" : "bg-gray-100"}`}
                  >
                    <option.icon className={`w-6 h-6 ${option.primary ? "text-white" : "text-gray-600"}`} />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {option.availability}
                    </Badge>
                  </div>
                  <Button
                    className={`w-full ${option.primary ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    variant={option.primary ? "default" : "outline"}
                  >
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {faqCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <category.icon className="w-5 h-5 mr-2 text-blue-600" />
                      {category.title}
                    </div>
                    <Badge variant="secondary">{category.count} articles</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <details key={faqIndex} className="group">
                        <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="font-medium">{faq.question}</span>
                          <CheckCircle className="w-4 h-4 text-gray-400 group-open:text-blue-600 transition-colors" />
                        </summary>
                        <div className="mt-2 p-3 text-gray-600 bg-gray-50 rounded-lg">{faq.answer}</div>
                      </details>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All {category.title} Articles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Still Need Help?</CardTitle>
              <CardDescription>Send us a message and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="Enter your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Enter your last name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="Enter your email address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="What's this about?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea placeholder="Describe your issue or question in detail..." rows={5} />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
            </CardContent>
          </Card>
        </section>

        {/* Additional Resources */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <CardTitle>User Guide</CardTitle>
                <CardDescription>Complete guide to using Tapstead</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Guide
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Settings className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Go to Settings
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <CardTitle>Community Forum</CardTitle>
                <CardDescription>Connect with other Tapstead users</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Visit Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
