import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin, Star } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/tapstead-logo.png"
                alt="Tapstead"
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Professional home services made simple. Transparent pricing, trusted pros, instant booking. Just tap.
              Done.
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-300">4.9/5 from 10,000+ customers</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/cleaning" className="text-gray-300 hover:text-white">
                  House Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/handyman" className="text-gray-300 hover:text-white">
                  Handyman
                </Link>
              </li>
              <li>
                <Link href="/services/plumbing" className="text-gray-300 hover:text-white">
                  Plumbing Services
                </Link>
              </li>
              <li>
                <Link href="/services/junk-removal" className="text-gray-300 hover:text-white">
                  Junk Removal
                </Link>
              </li>
              <li>
                <Link href="/services/pressure-washing" className="text-gray-300 hover:text-white">
                  Pressure Washing
                </Link>
              </li>
              <li>
                <Link href="/services/gutter-services" className="text-gray-300 hover:text-white">
                  Gutter Services
                </Link>
              </li>
              <li>
                <Link href="/services/electrical" className="text-gray-300 hover:text-white">
                  Electrical
                </Link>
              </li>
              <li>
                <Link href="/services/painting" className="text-gray-300 hover:text-white">
                  Painting
                </Link>
              </li>
              <li>
                <Link href="/services/welding" className="text-gray-300 hover:text-white">
                  Welding Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Emergency Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/fire-debris-removal" className="text-gray-300 hover:text-white">
                  Fire Debris Removal
                </Link>
              </li>
              <li>
                <Link href="/services/storm-damage-cleanup" className="text-gray-300 hover:text-white">
                  Storm Damage Cleanup
                </Link>
              </li>
              <li>
                <Link href="/services/emergency-disaster-cleanup" className="text-gray-300 hover:text-white">
                  Emergency Disaster Cleanup
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-red-400 hover:text-red-300 font-medium">
                  24/7 Emergency Hotline
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-6">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 font-medium">(555) DISASTER</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">hello@tapstead.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Available in 50+ cities</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white">
                Cookie Policy
              </Link>
              <Link href="/support" className="hover:text-white">
                Support
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm mt-8">
            © 2024 Tapstead. All rights reserved. | Licensed, Bonded & Insured
          </div>
        </div>
      </div>
    </footer>
  )
}
