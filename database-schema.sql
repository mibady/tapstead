-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  customer_type VARCHAR(50) DEFAULT 'homeowner',
  military_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(50),
  category VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  business_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  insurance_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_jobs INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  location VARCHAR(255),
  services TEXT[], -- Array of service IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  provider_id UUID REFERENCES providers(id),
  status VARCHAR(50) DEFAULT 'scheduled',
  scheduled_date DATE NOT NULL,
  scheduled_time VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  special_instructions TEXT,
  estimated_price DECIMAL(10,2) NOT NULL,
  final_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  monthly_price DECIMAL(10,2) NOT NULL,
  next_billing_date DATE NOT NULL,
  services_included TEXT[],
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tracking table
CREATE TABLE IF NOT EXISTS tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  provider_id UUID REFERENCES providers(id),
  status VARCHAR(50) NOT NULL,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent conversations table
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  agent_type VARCHAR(50) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  context_data JSONB,
  user_email VARCHAR(255),
  user_role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent interactions table for analytics
CREATE TABLE IF NOT EXISTS agent_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_type VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  tool_used VARCHAR(100),
  success BOOLEAN DEFAULT true,
  response_time_ms INTEGER,
  error_message TEXT,
  user_input TEXT,
  agent_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create provider applications table (if not exists)
CREATE TABLE IF NOT EXISTS provider_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company_name VARCHAR(255),
  services TEXT[] NOT NULL,
  experience_years INTEGER NOT NULL,
  license_number VARCHAR(100),
  insurance_provider VARCHAR(255),
  coverage_amount DECIMAL(12,2),
  service_areas TEXT[] NOT NULL,
  availability JSONB NOT NULL,
  emergency_services BOOLEAN DEFAULT false,
  background_check_consent BOOLEAN NOT NULL,
  terms_accepted BOOLEAN NOT NULL,
  additional_info TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_tracking_booking_id ON tracking(booking_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Agent-related indexes
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user_id ON agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_agent_type ON agent_conversations(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_session_id ON agent_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_agent_type ON agent_interactions(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_created_at ON agent_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_provider_applications_email ON provider_applications(email);
CREATE INDEX IF NOT EXISTS idx_provider_applications_status ON provider_applications(status);
