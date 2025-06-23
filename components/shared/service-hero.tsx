import { Button } from "@/components/ui/button"
import { Star, AlertTriangle, Shield, Clock, CheckCircle, Calendar, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ServiceHeroProps {
  title: string
  highlightWord: string
  description: string
  rating: number
  reviewCount: number
  price: string
  phoneNumber: string
  isEmergency?: boolean
  imageSrc?: string
  imageAlt?: string
}

export function ServiceHero({
  title,
  highlightWord,
  description,
  rating,
  reviewCount,
  price,
  phoneNumber,
  isEmergency = false,
  imageSrc = "/images/placeholder.jpg",
  imageAlt = "Service image"
}: ServiceHeroProps) {
  const fullTitle = title.split(highlightWord)
  
  return (
    <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl order-last lg:order-first">
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent lg:from-black/20 lg:to-black/10" />
            <div className="relative w-full h-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-background/90 p-3 rounded-lg shadow-md backdrop-blur-sm">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} 
                  />
                ))}
                <span className="ml-1 font-semibold text-sm">{rating.toFixed(1)}/5</span>
                <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()}+ jobs)</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="text-center lg:text-left">
            {isEmergency && (
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-destructive/10 text-destructive rounded-full">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">24/7 Emergency Service</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {fullTitle[0]}
              <span className="text-primary"> {highlightWord} </span>
              {fullTitle[1]}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl lg:max-w-none mx-auto lg:mx-0">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90" asChild>
                <Link href="/book-now">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now - {price}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-destructive text-destructive hover:bg-destructive/5" asChild>
                <a href={`tel:${phoneNumber.replace(/[^0-9]/g, '')}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {phoneNumber}
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span>24/7 Emergency</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <span>Parts Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
