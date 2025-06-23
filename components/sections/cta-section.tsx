import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of satisfied customers who trust Tapstead for their home service needs. Book your first
            service today and experience the difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Link href="/book-now">
                Book Your Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-2 border-white text-white bg-blue-700 hover:bg-white hover:text-blue-600"
            >
              <Link href="/become-pro">Become a Pro</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
