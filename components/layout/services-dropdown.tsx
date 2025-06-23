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
        <Button 
          variant="ghost" 
          className="text-foreground/80 hover:text-foreground hover:bg-accent font-medium h-auto p-0 text-sm"
        >
          Services
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 bg-background border-border shadow-lg" 
        align="start"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-foreground/70 font-semibold text-xs uppercase tracking-wider">
          Home Services
        </DropdownMenuLabel>
        
        <div className="grid grid-cols-2 gap-1 p-1">
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/house-cleaning" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              House Cleaning
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/handyman" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              Handyman
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/plumbing" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              Plumbing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/electrical" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              Electrical
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/painting" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              Painting
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/gutter-services" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              Gutter Services
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/pressure-washing" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              Pressure Washing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/junk-removal" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              Junk Removal
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link href="/services/welding" className="w-full px-3 py-2 text-sm hover:bg-accent rounded">
              Welding
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1" />
        
        <div>
          <DropdownMenuLabel className="text-destructive/90 font-semibold text-xs uppercase tracking-wider">
            Emergency Services
          </DropdownMenuLabel>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link 
              href="/services/fire-debris-removal" 
              className="w-full px-3 py-2 text-sm text-destructive/90 hover:bg-destructive/5 rounded"
            >
              Fire Debris Removal
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 rounded">
            <Link 
              href="/emergency" 
              className="w-full px-3 py-2 text-sm font-medium text-destructive/90 hover:bg-destructive/5 flex items-center rounded"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/80 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </span>
              24/7 Emergency Hotline
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem asChild className="p-0 rounded">
          <Link 
            href="/services" 
            className="w-full px-3 py-2 text-sm font-medium text-foreground/90 hover:bg-accent flex items-center justify-between rounded"
          >
            <span>View All Services</span>
            <span className="ml-2">→</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
