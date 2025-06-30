export interface Service {
  id: string;
  name: string;
  description: string;
  requiresQuote: boolean;
  bookingType: 'instant' | 'quote';
  rate?: { 
    min: number; 
    max: number; 
    unit: string; // 'per_hour' | 'per_room' | 'flat_rate'
  };
  features?: string[];
  estimatedDuration?: string;
  category: 'cleaning' | 'plumbing' | 'electrical' | 'handyman' | 'exterior' | 'emergency';
}

export const services: Service[] = [
  // ONLY HOME CLEANING is directly bookable
  { 
    id: 'home-cleaning', 
    name: 'Home Cleaning', 
    description: 'Professional house cleaning service with eco-friendly products',
    requiresQuote: false, 
    bookingType: 'instant',
    rate: { min: 99, max: 299, unit: 'per_visit' },
    features: ['Eco-friendly products', 'Insured cleaners', 'Same-day booking', 'Satisfaction guarantee'],
    estimatedDuration: '2-4 hours',
    category: 'cleaning'
  },
  
  // ALL OTHER SERVICES require on-site visit for quote
  { 
    id: 'plumbing', 
    name: 'Plumbing Services', 
    description: 'Licensed plumbers for repairs, installations, and emergency services',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Licensed professionals', 'Emergency available', 'Free estimates', 'Parts & labor warranty'],
    category: 'plumbing'
  },
  { 
    id: 'electrical', 
    name: 'Electrical Services', 
    description: 'Certified electricians for wiring, outlets, fixtures, and safety inspections',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Licensed electricians', 'Code compliance', 'Safety inspections', 'Emergency repairs'],
    category: 'electrical'
  },
  { 
    id: 'handyman', 
    name: 'Handyman Services', 
    description: 'General repairs, assembly, mounting, and home improvement projects',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Multi-skilled professionals', 'Own tools & equipment', 'Small to medium projects', 'Quality guarantee'],
    category: 'handyman'
  },
  { 
    id: 'gutter-services', 
    name: 'Gutter Cleaning & Repair', 
    description: 'Gutter cleaning, repair, installation, and maintenance services',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Safety equipment included', 'Debris removal', 'Inspection report', 'Seasonal maintenance'],
    category: 'exterior'
  },
  { 
    id: 'pressure-washing', 
    name: 'Pressure Washing', 
    description: 'Exterior cleaning for driveways, siding, decks, and outdoor surfaces',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Professional equipment', 'Surface-appropriate cleaning', 'Eco-friendly solutions', 'Property protection'],
    category: 'exterior'
  },
  { 
    id: 'painting', 
    name: 'Interior Painting', 
    description: 'Professional interior painting for rooms, trim, and detailed work',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Quality paints', 'Surface preparation', 'Clean-up included', 'Color consultation'],
    category: 'handyman'
  },
  { 
    id: 'junk-removal', 
    name: 'Junk Removal', 
    description: 'Furniture, appliance, and debris removal with eco-friendly disposal',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Same-day service', 'Eco-friendly disposal', 'Heavy lifting', 'Clean-up included'],
    category: 'handyman'
  },
  { 
    id: 'welding', 
    name: 'Welding Services', 
    description: 'Custom welding, repairs, and fabrication for residential projects',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Certified welders', 'Custom fabrication', 'Repair services', 'Mobile welding'],
    category: 'handyman'
  },
  { 
    id: 'emergency-disaster', 
    name: 'Emergency & Disaster Cleanup', 
    description: '24/7 emergency response for fire, water, storm damage, and restoration',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['24/7 emergency response', 'Insurance coordination', 'Damage assessment', 'Restoration services'],
    category: 'emergency'
  },
  { 
    id: 'fire-debris', 
    name: 'Fire Debris Removal', 
    description: 'Specialized cleanup and debris removal after fire damage',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Hazmat certified', 'Insurance assistance', 'Sensitive item recovery', 'Site security'],
    category: 'emergency'
  },
  { 
    id: 'storm-damage', 
    name: 'Storm Damage Cleanup', 
    description: 'Tree removal, roof repairs, and cleanup after severe weather',
    requiresQuote: true, 
    bookingType: 'quote',
    features: ['Emergency response', 'Tree removal', 'Temporary repairs', 'Insurance documentation'],
    category: 'emergency'
  },
];
