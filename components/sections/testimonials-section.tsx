import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Austin, TX",
    rating: 5,
    text: "Tapstead made finding a reliable house cleaner so easy. The professional arrived on time and did an amazing job. I'll definitely be using this service again!",
    service: "House Cleaning",
  },
  {
    name: "Mike Chen",
    location: "Denver, CO",
    rating: 5,
    text: "Had a plumbing emergency and Tapstead connected me with a plumber within 30 minutes. Professional, affordable, and got the job done right the first time.",
    service: "Emergency Plumbing",
  },
  {
    name: "Emily Rodriguez",
    location: "Phoenix, AZ",
    rating: 5,
    text: "The handyman service was excellent. Fixed multiple issues around my house in one visit. Great communication and fair pricing. Highly recommend!",
    service: "Handyman Services",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>

              <div className="border-t pt-4">
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">
                  {testimonial.location} • {testimonial.service}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
