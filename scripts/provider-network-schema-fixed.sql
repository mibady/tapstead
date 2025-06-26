-- Provider Applications Table (Fixed)
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

-- Provider References Table (Fixed)
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

-- Update existing providers table with new fields (Safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='tier') THEN
    ALTER TABLE providers ADD COLUMN tier VARCHAR(20) DEFAULT 'bronze';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='military_veteran') THEN
    ALTER TABLE providers ADD COLUMN military_veteran BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='availability') THEN
    ALTER TABLE providers ADD COLUMN availability JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='application_id') THEN
    ALTER TABLE providers ADD COLUMN application_id UUID REFERENCES provider_applications(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='services_offered') THEN
    ALTER TABLE providers ADD COLUMN services_offered TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='years_experience') THEN
    ALTER TABLE providers ADD COLUMN years_experience VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='insurance_verified') THEN
    ALTER TABLE providers ADD COLUMN insurance_verified BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='license_verified') THEN
    ALTER TABLE providers ADD COLUMN license_verified BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='background_check_status') THEN
    ALTER TABLE providers ADD COLUMN background_check_status VARCHAR(20) DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='providers' AND column_name='status') THEN
    ALTER TABLE providers ADD COLUMN status VARCHAR(20) DEFAULT 'active';
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_provider_applications_status ON provider_applications(status);
CREATE INDEX IF NOT EXISTS idx_provider_applications_email ON provider_applications(email);
CREATE INDEX IF NOT EXISTS idx_provider_applications_date ON provider_applications(application_date);
CREATE INDEX IF NOT EXISTS idx_provider_references_application ON provider_references(application_id);

-- RLS Policies (Fixed)
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_references ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can manage provider applications" ON provider_applications;
DROP POLICY IF EXISTS "Public can insert applications" ON provider_applications;

-- Admin can see all applications
CREATE POLICY "Admin can manage provider applications" ON provider_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND customer_type = 'admin'
    )
  );

-- Allow public to insert applications (for the application form)
CREATE POLICY "Public can insert applications" ON provider_applications
  FOR INSERT WITH CHECK (true);

-- References follow application permissions
CREATE POLICY "References follow application permissions" ON provider_references
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM provider_applications pa
      WHERE pa.id = provider_references.application_id
    )
  );
