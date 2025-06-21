import { Shield, Award, Clock, Users } from "lucide-react"

const trustFactors = [
  {
    icon: Shield,
    title: "Fully Insured",
    description: "All our professionals are fully insured and bonded for your peace of mind.",
  },
  {
    icon: Award,
    title: "Background Checked",
    description: "Every professional goes through comprehensive background checks and verification.",
  },
  {
    icon: Clock,
    title: "On-Time Guarantee",
    description: "We guarantee our professionals will arrive on time or we'll make it right.",
  },
  {
    icon: Users,
    title: "Customer Support",
    description: "24/7 customer support to help you before, during, and after your service.",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Trust Tapstead?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've built our platform with trust and safety as our top priorities. Here's what sets us apart.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFactors.map((factor, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <factor.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{factor.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
