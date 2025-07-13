-- Update existing schema for MVP requirements

-- Add house cleaning specific pricing
CREATE TABLE IF NOT EXISTS cleaning_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  house_size VARCHAR(20) NOT NULL CHECK (house_size IN ('small', 'medium', 'large')),
  base_price DECIMAL(10,2) NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('one-time', 'weekly', 'biweekly', 'monthly')),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert house cleaning pricing tiers
INSERT INTO cleaning_pricing (house_size, base_price, frequency, discount_percentage) VALUES
('small', 149.00, 'one-time', 0),
('medium', 199.00, 'one-time', 0),
('large', 299.00, 'one-time', 0),
('small', 149.00, 'weekly', 33),
('medium', 199.00, 'weekly', 33),
('large', 299.00, 'weekly', 33),
('small', 149.00, 'biweekly', 27),
('medium', 199.00, 'biweekly', 27),
('large', 299.00, 'biweekly', 27),
('small', 149.00, 'monthly', 20),
('medium', 199.00, 'monthly', 20),
('large', 299.00, 'monthly', 20);

-- Add cleaning add-ons
CREATE TABLE IF NOT EXISTS cleaning_addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO cleaning_addons (name, price, description) VALUES
('Deep Clean', 75.00, 'Intensive cleaning including baseboards, light fixtures, and detailed scrubbing'),
('Move In/Out', 99.00, 'Comprehensive cleaning for moving situations including inside appliances'),
('Inside Oven', 25.00, 'Deep cleaning of oven interior'),
('Inside Refrigerator', 25.00, 'Complete refrigerator cleaning inside and out'),
('Interior Windows', 35.00, 'Cleaning of interior window surfaces'),
('Garage Cleaning', 50.00, 'Basic garage sweep and organization');

-- Update bookings table for house cleaning specifics
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS house_size VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS frequency VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS add_ons TEXT[];
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(id);

-- Create quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  service_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[],
  address TEXT NOT NULL,
  property_type VARCHAR(100),
  property_size VARCHAR(100),
  preferred_date DATE,
  preferred_time VARCHAR(50),
  urgency VARCHAR(20) DEFAULT 'standard',
  estimated_budget VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES quote_requests(id),
  base_price DECIMAL(10,2) NOT NULL,
  adjustments JSONB DEFAULT '[]',
  final_price DECIMAL(10,2) NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update services table with MVP services
TRUNCATE TABLE services;
INSERT INTO services (id, title, description, base_price, duration, category, active) VALUES
('house-cleaning', 'House Cleaning', 'Professional house cleaning with eco-friendly products', 149.00, '2-4 hours', 'cleaning', true),
('handyman', 'Handyman Services', 'Small repairs, installations, furniture assembly', 75.00, '1-4 hours', 'maintenance', true),
('plumbing', 'Plumbing Services', 'Leak repairs, drain cleaning, fixture installation', 89.00, '1-6 hours', 'plumbing', true),
('junk-removal', 'Junk Removal', 'Furniture, appliances, construction debris removal', 149.00, '1-4 hours', 'removal', true),
('pressure-washing', 'Pressure Washing', 'Driveways, decks, siding cleaning', 199.00, '2-6 hours', 'cleaning', true),
('gutter-services', 'Gutter Services', 'Gutter cleaning, repairs, installation', 159.00, '2-5 hours', 'maintenance', true),
('electrical', 'Electrical Services', 'Outlet installation, lighting, ceiling fans', 125.00, '1-8 hours', 'electrical', true),
('painting', 'Interior Painting', 'Room painting, touch-ups, color consultation', 299.00, '1-3 days', 'painting', true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quote_requests_user_id ON quote_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_bookings_house_size ON bookings(house_size);
CREATE INDEX IF NOT EXISTS idx_bookings_frequency ON bookings(frequency);
