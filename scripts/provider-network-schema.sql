-- Provider Applications Table
CREATE TABLE IF NOT EXISTS provider_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  business_name VARCHAR(255),
  years_experience VARCHAR(20),
  previous_work TEXT,
  specializations TEXT,
  military_veteran BOOLEAN DEFAULT FALSE,
  has_insurance BOOLEAN DEFAULT FALSE,
  insurance_amount VARCHAR(20),
  has_license BOOLEAN DEFAULT FALSE,
  license_number VARCHAR(100),
  license_state VARCHAR(50),
  selected_services TEXT[], -- Array of service IDs
  availability JSONB, -- Days of week availability
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, under_review
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider References Table
CREATE TABLE IF NOT EXISTS provider_references (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES provider_applications(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  relationship VARCHAR(255),
  contacted BOOLEAN DEFAULT FALSE,
  contact_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing providers table with new fields
ALTER TABLE providers ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'bronze';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS military_veteran BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS availability JSONB;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES provider_applications(id);

-- Provider Performance Metrics Table
CREATE TABLE IF NOT EXISTS provider_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  month_year VARCHAR(7), -- Format: 2024-01
  jobs_completed INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  on_time_percentage DECIMAL(5,2) DEFAULT 0,
  customer_satisfaction DECIMAL(3,2) DEFAULT 0,
  tier_at_month VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, month_year)
);

-- Provider Earnings Table
CREATE TABLE IF NOT EXISTS provider_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  base_amount DECIMAL(10,2) NOT NULL,
  bonus_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_provider_applications_status ON provider_applications(status);
CREATE INDEX IF NOT EXISTS idx_provider_applications_email ON provider_applications(email);
CREATE INDEX IF NOT EXISTS idx_provider_performance_provider_month ON provider_performance(provider_id, month_year);
CREATE INDEX IF NOT EXISTS idx_provider_earnings_provider ON provider_earnings(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_earnings_booking ON provider_earnings(booking_id);

-- RLS Policies
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_earnings ENABLE ROW LEVEL SECURITY;

-- Admin can see all applications
CREATE POLICY "Admin can manage provider applications" ON provider_applications
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Providers can see their own performance data
CREATE POLICY "Providers can view own performance" ON provider_performance
  FOR SELECT USING (
    provider_id IN (
      SELECT id FROM providers WHERE user_id = auth.uid()
    )
  );

-- Providers can see their own earnings
CREATE POLICY "Providers can view own earnings" ON provider_earnings
  FOR SELECT USING (
    provider_id IN (
      SELECT id FROM providers WHERE user_id = auth.uid()
    )
  );
