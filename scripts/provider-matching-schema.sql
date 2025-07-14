-- Provider matching and Cal.com integration schema updates

-- Add Cal.com integration fields to providers table
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS cal_com_user_id INTEGER,
ADD COLUMN IF NOT EXISTS cal_com_event_type_id INTEGER,
ADD COLUMN IF NOT EXISTS cal_com_webhook_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS availability_radius INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS base_rate DECIMAL(10,2) DEFAULT 75.00,
ADD COLUMN IF NOT EXISTS military_veteran BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS specialties TEXT[], -- Array of specialties
ADD COLUMN IF NOT EXISTS emergency_services BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS instant_booking BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS auto_confirm BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_providers_location ON providers USING GIST (
  ll_to_earth(latitude, longitude)
);

CREATE INDEX IF NOT EXISTS idx_providers_services ON providers USING GIN (services);
CREATE INDEX IF NOT EXISTS idx_providers_specialties ON providers USING GIN (specialties);
CREATE INDEX IF NOT EXISTS idx_providers_active_rating ON providers (active, rating DESC);
CREATE INDEX IF NOT EXISTS idx_providers_military_veteran ON providers (military_veteran) WHERE military_veteran = TRUE;

-- Add Cal.com booking tracking
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS cal_com_booking_id INTEGER,
ADD COLUMN IF NOT EXISTS cal_com_uid VARCHAR(255),
ADD COLUMN IF NOT EXISTS cal_com_event_type_id INTEGER,
ADD COLUMN IF NOT EXISTS urgency VARCHAR(20) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 120, -- minutes
ADD COLUMN IF NOT EXISTS travel_time INTEGER, -- minutes
ADD COLUMN IF NOT EXISTS pricing_breakdown JSONB;

-- Create unique index on Cal.com UID
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_cal_com_uid ON bookings (cal_com_uid) WHERE cal_com_uid IS NOT NULL;

-- Add booking status tracking
CREATE TYPE booking_status_enum AS ENUM (
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'rescheduled',
  'no_show'
);

ALTER TABLE bookings 
ALTER COLUMN status TYPE booking_status_enum USING status::booking_status_enum;

-- Provider availability tracking table
CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(provider_id, date, start_time, end_time)
);

CREATE INDEX IF NOT EXISTS idx_provider_availability_date ON provider_availability (provider_id, date);
CREATE INDEX IF NOT EXISTS idx_provider_availability_booking ON provider_availability (booking_id) WHERE booking_id IS NOT NULL;

-- Provider metrics for matching algorithm
CREATE TABLE IF NOT EXISTS provider_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE UNIQUE,
  total_bookings INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  cancelled_bookings INTEGER DEFAULT 0,
  average_response_time INTEGER, -- minutes
  average_completion_time INTEGER, -- minutes
  customer_satisfaction_score DECIMAL(3,2), -- 0.00 to 5.00
  on_time_percentage DECIMAL(5,2), -- 0.00 to 100.00
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service area definitions for providers
CREATE TABLE IF NOT EXISTS provider_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  area_name VARCHAR(255) NOT NULL,
  center_latitude DECIMAL(10, 8) NOT NULL,
  center_longitude DECIMAL(11, 8) NOT NULL,
  radius_miles INTEGER NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(provider_id, area_name)
);

CREATE INDEX IF NOT EXISTS idx_provider_service_areas_location ON provider_service_areas USING GIST (
  ll_to_earth(center_latitude, center_longitude)
);

-- Pricing rules for dynamic pricing
CREATE TABLE IF NOT EXISTS provider_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL,
  base_rate DECIMAL(10,2) NOT NULL,
  urgency_multiplier JSONB DEFAULT '{"standard": 1.0, "urgent": 1.25, "emergency": 1.5}',
  distance_rate DECIMAL(10,2) DEFAULT 3.00, -- per mile over base distance
  base_distance INTEGER DEFAULT 15, -- miles included in base rate
  minimum_charge DECIMAL(10,2),
  maximum_charge DECIMAL(10,2),
  effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  effective_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(provider_id, service_type, effective_from)
);

-- Cal.com webhook events log
CREATE TABLE IF NOT EXISTS cal_com_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id VARCHAR(255),
  event_type VARCHAR(100) NOT NULL,
  booking_uid VARCHAR(255),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cal_com_webhook_events_booking_uid ON cal_com_webhook_events (booking_uid);
CREATE INDEX IF NOT EXISTS idx_cal_com_webhook_events_processed ON cal_com_webhook_events (processed, created_at);

-- Function to update provider metrics
CREATE OR REPLACE FUNCTION update_provider_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update metrics when booking status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO provider_metrics (provider_id)
    VALUES (NEW.provider_id)
    ON CONFLICT (provider_id) DO NOTHING;
    
    -- Recalculate metrics
    UPDATE provider_metrics 
    SET 
      total_bookings = (
        SELECT COUNT(*) 
        FROM bookings 
        WHERE provider_id = NEW.provider_id
      ),
      completed_bookings = (
        SELECT COUNT(*) 
        FROM bookings 
        WHERE provider_id = NEW.provider_id AND status = 'completed'
      ),
      cancelled_bookings = (
        SELECT COUNT(*) 
        FROM bookings 
        WHERE provider_id = NEW.provider_id AND status = 'cancelled'
      ),
      updated_at = NOW()
    WHERE provider_id = NEW.provider_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for provider metrics
DROP TRIGGER IF EXISTS trigger_update_provider_metrics ON bookings;
CREATE TRIGGER trigger_update_provider_metrics
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_metrics();

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL, 
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN earth_distance(
    ll_to_earth(lat1, lon1),
    ll_to_earth(lat2, lon2)
  ) * 0.000621371; -- Convert meters to miles
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO providers (
  id, user_id, services, latitude, longitude, rating, review_count,
  cal_com_user_id, cal_com_event_type_id, availability_radius, base_rate,
  military_veteran, years_experience, business_name, specialties, active
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM users LIMIT 1),
  ARRAY['plumbing', 'emergency-plumbing'],
  40.7128, -74.0060,
  4.8, 127,
  12345, 67890,
  30, 85.00,
  TRUE, 12,
  'Elite Plumbing Services',
  ARRAY['emergency repairs', 'pipe installation', 'drain cleaning'],
  TRUE
),
(
  gen_random_uuid(),
  (SELECT id FROM users LIMIT 1),
  ARRAY['electrical', 'emergency-electrical'],
  40.7589, -73.9851,
  4.6, 89,
  12346, 67891,
  25, 95.00,
  FALSE, 8,
  'PowerPro Electric',
  ARRAY['wiring', 'panel upgrades', 'troubleshooting'],
  TRUE
),
(
  gen_random_uuid(),
  (SELECT id FROM users LIMIT 1),
  ARRAY['house-cleaning', 'deep-cleaning'],
  40.6892, -74.0445,
  4.9, 203,
  12347, 67892,
  20, 65.00,
  TRUE, 6,
  'Spotless Home Solutions',
  ARRAY['eco-friendly', 'pet-safe', 'move-in/out'],
  TRUE
)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON provider_availability TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON provider_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON provider_service_areas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON provider_pricing_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON cal_com_webhook_events TO authenticated;

-- Enable RLS (Row Level Security)
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cal_com_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for provider tables
CREATE POLICY "Providers can manage their own availability" ON provider_availability
  FOR ALL USING (
    provider_id IN (
      SELECT id FROM providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can view their own metrics" ON provider_metrics
  FOR SELECT USING (
    provider_id IN (
      SELECT id FROM providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can manage their service areas" ON provider_service_areas
  FOR ALL USING (
    provider_id IN (
      SELECT id FROM providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can manage their pricing rules" ON provider_pricing_rules
  FOR ALL USING (
    provider_id IN (
      SELECT id FROM providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage webhook events" ON cal_com_webhook_events
  FOR ALL USING (true);

-- Comments for documentation
COMMENT ON TABLE provider_availability IS 'Tracks provider availability slots and bookings';
COMMENT ON TABLE provider_metrics IS 'Stores calculated metrics for provider matching algorithm';
COMMENT ON TABLE provider_service_areas IS 'Defines geographic service areas for each provider';
COMMENT ON TABLE provider_pricing_rules IS 'Dynamic pricing rules based on service type and conditions';
COMMENT ON TABLE cal_com_webhook_events IS 'Log of Cal.com webhook events for debugging and processing';
