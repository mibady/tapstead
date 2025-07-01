"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ServicesDropdown } from "./services-dropdown"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/tapstead-logo.png"
              alt="Tapstead Logo"
              width={150}
              height={50}
              className="h-24 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <ServicesDropdown />
            <Link href="/pricing" className="text-foreground/80 hover:text-foreground font-medium transition-colors text-sm">
              Pricing
            </Link>
            <Link href="/how-it-works" className="text-foreground/80 hover:text-foreground font-medium transition-colors text-sm">
              How It Works
            </Link>
            <Link href="/about" className="text-foreground/80 hover:text-foreground font-medium transition-colors text-sm">
              About
            </Link>
            <Link href="/blog" className="text-foreground/80 hover:text-foreground font-medium transition-colors text-sm">
              Blog
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" asChild className="border-foreground/20 text-foreground/80 hover:bg-accent hover:text-foreground">
              <Link href="/become-pro">Become a Pro</Link>
            </Button>
            <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
              <Link href="/services">Book Service</Link>
            </Button>
            <Button variant="ghost" asChild className="text-foreground/80 hover:bg-accent hover:text-foreground">
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-4 px-4">
              <Link
                href="/services"
                className="text-foreground/80 hover:text-foreground font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/pricing"
                className="text-foreground/80 hover:text-foreground font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/how-it-works"
                className="text-foreground/80 hover:text-foreground font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="text-foreground/80 hover:text-foreground font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-foreground/80 hover:text-foreground font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="pt-2 mt-2 border-t border-border">
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-foreground/20 text-foreground/80 hover:bg-accent hover:text-foreground mb-3"
                >
                  <Link href="/become-pro" onClick={() => setIsMenuOpen(false)}>
                    Become a Pro
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-foreground text-background hover:bg-foreground/90 mb-3"
                >
                  <Link href="/services" onClick={() => setIsMenuOpen(false)}>
                    Book Service
                  </Link>
                </Button>
                <Link
                  href="/auth"
                  className="text-foreground/80 hover:text-foreground font-medium text-center block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
