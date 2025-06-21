"use client"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function ServicesDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium h-auto p-0">
          Services
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Home Services</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/services/house-cleaning" className="w-full">
            House Cleaning
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/handyman" className="w-full">
            Handyman Services
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/plumbing" className="w-full">
            Plumbing Services
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/electrical" className="w-full">
            Electrical Services
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/painting" className="w-full">
            Painting Services
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/gutter-services" className="w-full">
            Gutter Services
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/pressure-washing" className="w-full">
            Pressure Washing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/junk-removal" className="w-full">
            Junk Removal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/welding" className="w-full">
            Welding Services
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-red-600">Emergency Services</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/services/fire-debris-removal" className="w-full text-red-600">
            Fire Debris Removal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/emergency" className="w-full text-red-600 font-medium">
            24/7 Emergency Hotline
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/services" className="w-full font-medium">
            View All Services →
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
