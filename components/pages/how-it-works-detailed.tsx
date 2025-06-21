import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Smartphone,
  Calendar,
  CheckCircle,
  Shield,
  Star,
  CreditCard,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  Users,
  Award,
} from "lucide-react"
import Link from "next/link"

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Book in 60 Seconds",
    subtitle: "Choose your service and schedule",
    description:
      "Select the service you need, choose your preferred date and time, and provide your address. Our transparent pricing means you'll see the exact cost upfront - no surprises, no hidden fees.",
    features: [
      "Browse all available services",
      "See upfront pricing instantly",
      "Choose your preferred time slot",
      "Add special instructions",
      "Secure payment processing",
    ],
    highlight: "Average booking time: 45 seconds",
  },
  {
    number: "02",
    icon: Calendar,
    title: "We Handle Everything",
    subtitle: "Professional service delivery",
    description:
      "Our vetted professionals arrive on time with all necessary tools and materials. Track your service in real-time, communicate directly with your pro, and relax while we take care of everything.",
    features: [
      "Background-checked professionals",
      "Real-time service tracking",
      "Direct communication with your pro",
      "All tools and materials included",
      "Insurance coverage up to $2M",
    ],
    highlight: "98% on-time arrival rate",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Job Done Right",
    subtitle: "Quality guaranteed satisfaction",
    description:
      "Quality work guaranteed with our satisfaction promise. Rate your experience, provide feedback, and enjoy your perfectly maintained home. If you're not happy, we'll make it right.",
    features: [
      "100% satisfaction guarantee",
      "Quality inspection included",
      "Easy rating and review system",
      "Follow-up customer care",
      "Warranty on all work performed",
    ],
    highlight: "4.9/5 average customer rating",
  },
]

const processDetails = [
  {
    phase: "Before Service",
    items: [
      "Service confirmation email sent",
      "Professional assigned to your job",
      "Pre-service reminder 24 hours before",
      "Pro contact information shared",
      "Special instructions reviewed",
    ],
  },
  {
    phase: "During Service",
    items: [
      "Professional arrives on time",
      "Real-time tracking available",
      "Direct communication with pro",
      "Progress updates as needed",
      "Quality checks throughout",
    ],
  },
  {
    phase: "After Service",
    items: [
      "Final quality inspection",
      "Service completion notification",
      "Digital receipt and invoice",
      "Rating and review request",
      "Follow-up customer care",
    ],
  },
]

const qualityStandards = [
  {
    icon: Shield,
    title: "Vetted Professionals",
    description: "Background checks, license verification, and insurance requirements for all pros",
  },
  {
    icon: Star,
    title: "Quality Assurance",
    description: "Regular quality audits, customer feedback monitoring, and continuous training",
  },
  {
    icon: Award,
    title: "Satisfaction Guarantee",
    description: "100% satisfaction promise - we'll make it right or refund your money",
  },
  {
    icon: Users,
    title: "Customer Support",
    description: "24/7 customer support team available to help with any questions or concerns",
  },
]

export function HowItWorksDetailed() {
  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">How Tapstead Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Three simple steps to a perfectly maintained home. No hassle, no surprises, just results. From booking to
            completion, we've streamlined every part of the process.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/book-now">Try It Now - Book a Service</Link>
          </Button>
        </div>
      </section>

      {/* Main Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-6xl font-bold text-blue-100">{step.number}</div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <step.icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{step.title}</h2>
                    <p className="text-xl text-blue-600 font-medium mb-4">{step.subtitle}</p>
                    <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">{step.highlight}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                    <ul className="space-y-2">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Image/Visual */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <div className="bg-gray-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                    <step.icon className="w-32 h-32 text-blue-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Detailed Process Timeline</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here's exactly what happens from booking to completion
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {processDetails.map((phase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-center">{phase.phase}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technology That Works for You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use cutting-edge technology to make home services simple and reliable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Real-Time Tracking</h3>
                <p className="text-gray-600">Track your service professional's location and estimated arrival time</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Direct Communication</h3>
                <p className="text-gray-600">Message or call your pro directly through our secure platform</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
                <p className="text-gray-600">Safe, encrypted payment processing with automatic receipts</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support for any questions or concerns</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Quality Standards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every professional and service meets our rigorous quality standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {qualityStandards.map((standard, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                      <standard.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">{standard.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{standard.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join thousands of homeowners who've discovered the easiest way to maintain their homes. Book your first
            service today and see why Tapstead is the future of home services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/book-now">
                Book Your First Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
              asChild
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
