import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin, Star, Clock, Shield, Award } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/tapstead-logo.png"
                alt="Tapstead"
                width={140}
                height={45}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Professional home services made simple. Transparent pricing, trusted pros, instant booking. Licensed,
              bonded & insured for your peace of mind.
            </p>

            {/* Trust Indicators */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-300">4.9/5 from 2,500+ customers</span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>Background Checked</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Stay Updated</h4>
              <p className="text-sm text-gray-400">Get tips, deals, and service updates</p>
              <div className="flex space-x-2 max-w-sm">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 px-6">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Popular Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/house-cleaning"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  House Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/handyman" className="text-gray-300 hover:text-white transition-colors">
                  Handyman Services
                </Link>
              </li>
              <li>
                <Link href="/services/plumbing" className="text-gray-300 hover:text-white transition-colors">
                  Plumbing Services
                </Link>
              </li>
              <li>
                <Link href="/services/electrical" className="text-gray-300 hover:text-white transition-colors">
                  Electrical Services
                </Link>
              </li>
              <li>
                <Link href="/services/junk-removal" className="text-gray-300 hover:text-white transition-colors">
                  Junk Removal
                </Link>
              </li>
              <li>
                <Link href="/services/pressure-washing" className="text-gray-300 hover:text-white transition-colors">
                  Pressure Washing
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-white transition-colors">
                  Press & Media
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/become-pro" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Become a Pro →
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Support & Contact</h3>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <div className="text-blue-300 font-medium">(360) 641-7386</div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    24/7 Voice Assistant
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">info@tapstead.com</span>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">Available in 15+ cities</span>
              </div>
            </div>

            {/* Support Links */}
            <ul className="space-y-3">
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Emergency Services
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">© {currentYear} Tapstead. All rights reserved.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 mr-2">Follow us:</span>
              <Link
                href="https://facebook.com/tapstead"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com/tapstead"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com/tapstead"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com/company/tapstead"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
