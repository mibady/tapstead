import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, TrendingUp, Shield, DollarSign, CheckCircle, Star, Phone, Mail } from "lucide-react"

const contractorPositions = [
  {
    title: "House Cleaning Professional",
    priority: true,
    location: "Seattle Metro Area",
    type: "Independent Contractor",
    earnings: "$800-1,500+ per week",
    commission: "70-80% of service fees",
    description:
      "Transform homes while building your own cleaning business. We provide the customers, you provide exceptional service.",
    earningsBreakdown: [
      "1-2 Bedroom Homes: $105-120 per clean",
      "3-4 Bedroom Homes: $140-160 per clean",
      "5+ Bedroom Homes: $210-240 per clean",
    ],
    requirements: [
      "2+ years professional cleaning experience",
      "Own transportation & supplies",
      "General liability insurance",
      "Pass background check",
    ],
  },
  {
    title: "Licensed Plumbers",
    location: "King County",
    type: "Independent Contractor",
    earnings: "$45-75 per hour",
    commission: "Emergency Premium: Up to $100/hour",
    description:
      "Join our network of licensed plumbing professionals. Handle everything from leaky faucets to water heater installations.",
    requirements: [
      "Valid WA State plumbing license",
      "5+ years experience",
      "Professional toolkit",
      "Emergency availability",
    ],
  },
  {
    title: "Licensed Electricians",
    location: "Seattle Metro",
    type: "Independent Contractor",
    earnings: "$45-80 per hour",
    commission: "Smart home & emergency premiums",
    description:
      "Provide electrical services from outlet installations to panel upgrades with emergency service opportunities.",
    requirements: [
      "Valid WA State electrical license",
      "4+ years experience",
      "Complete electrical toolkit",
      "Code knowledge",
    ],
  },
  {
    title: "Handyman Services",
    location: "Greater Seattle Area",
    type: "Independent Contractor",
    earnings: "$24-35 per hour",
    commission: "Flexible project-based work",
    description:
      "Handle home repairs, installations, and maintenance projects. From TV mounting to furniture assembly.",
    requirements: ["3+ years handyman experience", "Complete tool set", "Reliable vehicle", "Problem-solving skills"],
  },
  {
    title: "Painting Contractors",
    location: "Seattle Area",
    type: "Independent Contractor",
    earnings: "$21-36 per hour",
    commission: "Projects: $300-5,000+ per job",
    description: "Interior and exterior painting projects. From single rooms to whole house transformations.",
    requirements: [
      "3+ years painting experience",
      "Professional equipment",
      "Color consultation skills",
      "Quality standards",
    ],
  },
  {
    title: "Emergency Services (24/7)",
    location: "Greater Seattle",
    type: "On-Call Contractor",
    earnings: "$52-80 per hour",
    commission: "Emergency Bonus: Up to $100/hour",
    description: "Be part of our emergency response team. Handle urgent plumbing, electrical, and structural issues.",
    requirements: [
      "Relevant trade license",
      "5+ years emergency experience",
      "24/7 availability",
      "Emergency response vehicle",
    ],
  },
]

const benefits = [
  {
    icon: DollarSign,
    title: "Maximize Your Earnings",
    description:
      "70-80% commission structure. Keep the majority of what you earn with weekly direct deposit every Friday.",
  },
  {
    icon: Users,
    title: "We Handle the Business Side",
    description: "Customer acquisition, scheduling, dispatch, and payment processing. Focus on the work you love.",
  },
  {
    icon: Shield,
    title: "Support & Protection",
    description: "24/7 support team, insurance programs, and quality assurance protection for all contractors.",
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description: "Multi-service expansion, performance bonuses, referral programs, and priority job assignments.",
  },
]

const testimonials = [
  {
    name: "Sarah M.",
    role: "House Cleaning Professional",
    quote:
      "I went from making $15/hour to earning $1,200 per week with Tapstead. The flexibility lets me pick up my kids from school while building my own cleaning business.",
  },
  {
    name: "Mike R.",
    role: "Licensed Plumber",
    quote:
      "As a licensed plumber, Tapstead gives me steady work without the overhead of running my own business. I focus on the work I love while they handle everything else.",
  },
  {
    name: "Jennifer L.",
    role: "Handyman Services",
    quote:
      "The customer support is incredible. When issues come up, Tapstead handles them immediately. I've never had to chase a payment or deal with difficult customers.",
  },
]

const applicationSteps = [
  {
    step: "1",
    title: "Apply Online",
    duration: "5 minutes",
    description: "Complete our quick application with your experience and availability details.",
  },
  {
    step: "2",
    title: "Phone Interview",
    duration: "15 minutes",
    description: "Brief conversation about your background and the opportunity.",
  },
  {
    step: "3",
    title: "Background Check",
    duration: "2-3 days",
    description: "Professional screening and reference verification.",
  },
  {
    step: "4",
    title: "Skill Assessment",
    duration: "Varies",
    description: "Quick evaluation of your work quality and customer service approach.",
  },
  {
    step: "5",
    title: "Start Earning",
    duration: "Same week",
    description: "Begin receiving job assignments and start building your business.",
  },
]

const faqs = [
  {
    question: "How much can I really earn?",
    answer:
      "House Cleaners: $800-1,500+ per week depending on how many jobs you want. Licensed Trades: $3,000-8,000+ per month with emergency availability. Handyman Services: $2,000-5,000+ per month based on skills and availability.",
  },
  {
    question: "When do I get paid?",
    answer: "Every Friday via direct deposit for work completed the previous week (Monday-Sunday).",
  },
  {
    question: "Do I need my own insurance?",
    answer: "Yes, general liability insurance is required. We can connect you with affordable providers if needed.",
  },
  {
    question: "What if a customer isn't satisfied?",
    answer:
      "Our customer service team handles all complaints and issues. We protect our contractors from unfair customer demands while ensuring quality standards.",
  },
  {
    question: "Can I choose my own schedule?",
    answer:
      "Absolutely. Set your availability and we'll send job opportunities that match your schedule. You're never required to accept any job.",
  },
]

export function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join the Future of
            <span className="block text-yellow-400">Home Services</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Build your own business with Tapstead's support. Earn $800-$1,500+ per week as an independent contractor
            while we handle customer acquisition, scheduling, and payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              View Open Positions
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Why Choose Tapstead?
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$1,200</div>
              <div className="text-gray-600">Average Weekly Earnings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Active Contractors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Contractor Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-gray-600">Jobs Completed Monthly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Contractor Positions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our network of independent professionals and build your own business with our platform support.
            </p>
          </div>
          <div className="space-y-6 max-w-5xl mx-auto">
            {contractorPositions.map((position, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow ${position.priority ? "border-2 border-blue-500 bg-blue-50" : ""}`}
              >
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        {position.priority && <Badge className="bg-blue-600 text-white">NOW HIRING</Badge>}
                      </div>
                      <CardDescription className="text-base mb-3">{position.description}</CardDescription>
                      {position.earningsBreakdown && (
                        <div className="mb-3">
                          <h4 className="font-semibold text-sm mb-2">What You'll Earn:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {position.earningsBreakdown.map((earning, idx) => (
                              <li key={idx}>• {earning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 lg:text-right">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-green-600">{position.earnings}</div>
                        <div className="text-sm text-blue-600 font-medium">{position.commission}</div>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {position.type}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="grid md:grid-cols-2 gap-1 text-sm text-gray-600">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full md:w-auto">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Tapstead */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Tapstead?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the support and tools you need to build a successful contracting business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Contractors Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from contractors building successful businesses with Tapstead
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Application Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just 5 steps and begin earning within the same week
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-6">
              {applicationSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-blue-600 mb-2">({step.duration})</p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about joining our contractor network
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of contractors already earning more with Tapstead's support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Application Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Chat with AI Recruiting Assistant
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              (360) 641-7386
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              careers@tapstead.com
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
