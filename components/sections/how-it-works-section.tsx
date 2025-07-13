import Image from "next/image"
import { Search, Calendar, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Choose Your Service",
    description: "Browse our wide range of professional home services and select what you need.",
  },
  {
    icon: Calendar,
    title: "Schedule & Book",
    description: "Pick a convenient time that works for you and book instantly online.",
  },
  {
    icon: CheckCircle,
    title: "Get It Done",
    description: "Our vetted professionals arrive on time and complete the job to your satisfaction.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting professional help for your home has never been easier. Just three simple steps to get the job done.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <step.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <Image
            src="/images/booking-process.png"
            alt="Booking process illustration"
            width={800}
            height={400}
            className="mx-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
