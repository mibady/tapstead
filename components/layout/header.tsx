"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const services = [
    { name: "House Cleaning", href: "/services/house-cleaning", featured: true },
    { name: "Handyman Services", href: "/services/handyman" },
    { name: "Plumbing Services", href: "/services/plumbing" },
    { name: "Electrical Services", href: "/services/electrical" },
    { name: "Junk Removal", href: "/services/junk-removal" },
    { name: "Pressure Washing", href: "/services/pressure-washing" },
    { name: "Gutter Services", href: "/services/gutter-services" },
    { name: "Painting Services", href: "/services/painting" },
    { name: "Welding Services", href: "/services/welding" },
  ]

  const emergencyServices = [
    { name: "Fire Debris Removal", href: "/services/fire-debris-removal" },
    { name: "Storm Damage Cleanup", href: "/services/storm-damage-cleanup" },
    { name: "Emergency Disaster Cleanup", href: "/services/emergency-disaster-cleanup" },
  ]

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/images/tapstead-logo.png"
              alt="Tapstead"
              width={140}
              height={45}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="pb-2 mb-2 border-b border-gray-100">
                    <h3 className="font-semibold text-sm text-gray-900 mb-2">Popular Services</h3>
                    {services.slice(0, 4).map((service) => (
                      <DropdownMenuItem key={service.href} asChild>
                        <Link
                          href={service.href}
                          className={`block px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${
                            service.featured ? "text-blue-600 font-medium" : "text-gray-700"
                          }`}
                        >
                          {service.name}
                          {service.featured && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Featured</span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="pb-2 mb-2 border-b border-gray-100">
                    <h3 className="font-semibold text-sm text-gray-900 mb-2">More Services</h3>
                    {services.slice(4).map((service) => (
                      <DropdownMenuItem key={service.href} asChild>
                        <Link
                          href={service.href}
                          className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          {service.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-red-600 mb-2">Emergency Services</h3>
                    {emergencyServices.map((service) => (
                      <DropdownMenuItem key={service.href} asChild>
                        <Link
                          href={service.href}
                          className="block px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                        >
                          {service.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/emergency"
                        className="block px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 border-t border-red-100 mt-2 pt-3"
                      >
                        24/7 Emergency Hotline
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Pricing
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Support
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button variant="outline" asChild className="min-w-[120px] bg-transparent">
              <Link href="/become-pro">Become a Pro</Link>
            </Button>
            <Button asChild className="min-w-[100px] bg-blue-600 hover:bg-blue-700">
              <Link href="/book-now">Book Now</Link>
            </Button>
            <Button variant="ghost" asChild className="min-w-[80px]">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white">
            <nav className="flex flex-col space-y-1">
              {/* Services Section */}
              <div className="pb-4 mb-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 px-3">Services</h3>
                <div className="space-y-1">
                  {services.slice(0, 3).map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                        service.featured ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {service.name}
                      {service.featured && <span className="ml-2 text-xs">Featured</span>}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    className="block px-3 py-2 text-sm text-blue-600 font-medium rounded-md hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View All Services →
                  </Link>
                </div>
              </div>

              {/* Main Navigation */}
              <Link
                href="/pricing"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium transition-colors rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/how-it-works"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium transition-colors rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium transition-colors rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/support"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium transition-colors rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>

              {/* Emergency Services */}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  href="/emergency"
                  className="block px-3 py-2 text-red-600 font-medium hover:bg-red-50 transition-colors rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🚨 24/7 Emergency Services
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col space-y-3 pt-6 mt-6 border-t border-gray-200">
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/become-pro" onClick={() => setIsMenuOpen(false)}>
                    Become a Pro
                  </Link>
                </Button>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/book-now" onClick={() => setIsMenuOpen(false)}>
                    Book Now
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
