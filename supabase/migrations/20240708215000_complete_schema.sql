-- Complete Schema Migration for Tapstead
-- This migration combines all schema changes in the correct order

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Create enums first (no dependencies)
DO $$
BEGIN
    -- Only create enums if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
        CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_type') THEN
        CREATE TYPE service_type AS ENUM (
            'plumbing', 'electrical', 'cleaning', 'handyman', 'painting', 
            'landscaping', 'hvac', 'pest_control', 'moving', 'other'
        );
    END IF;
END $$;

-- 3. Create tables in dependency order
-- 3.1 Services first (referenced by other tables)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type service_type NOT NULL,
    description TEXT,
    base_price NUMERIC,
    hourly_rate NUMERIC,
    available BOOLEAN DEFAULT true,
    features TEXT[],
    requirements TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Profiles (referenced by other tables)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    coordinates GEOGRAPHY(POINT),
    customer_type TEXT CHECK (customer_type IN ('residential', 'commercial')),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    military_status BOOLEAN DEFAULT false,
    background_check_consent BOOLEAN DEFAULT false,
    license_number TEXT,
    insurance_provider TEXT,
    coverage_amount NUMERIC,
    service_areas TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Provider services (depends on profiles and services)
CREATE TABLE IF NOT EXISTS provider_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    price_adjustment NUMERIC DEFAULT 0,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider_id, service_id)
);

-- 3.4 Bookings (depends on profiles and services)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    scheduled_date TIMESTAMPTZ,
    duration_hours NUMERIC,
    price NUMERIC NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    coordinates GEOGRAPHY(POINT),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Reviews (depends on bookings and profiles)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Verification requests (depends on profiles)
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status verification_status NOT NULL DEFAULT 'pending',
    submitted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    documents TEXT[],
    admin_notes TEXT,
    processed_by UUID REFERENCES profiles(id),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 Admin audit log (depends on profiles)
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    target_user UUID REFERENCES profiles(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes
-- 4.1 Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_coordinates ON profiles USING GIST(coordinates);

-- 4.2 Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_coordinates ON bookings USING GIST(coordinates);

-- 4.3 Provider services indexes
CREATE INDEX IF NOT EXISTS idx_provider_services_provider ON provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_service ON provider_services(service_id);

-- 4.4 Verification requests indexes
CREATE INDEX IF NOT EXISTS idx_verification_requests_provider ON verification_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);

-- 4.5 Admin audit log indexes
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON admin_audit_log(created_at);

-- 5. Create helper functions
-- 5.1 Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5.2 Admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.3 Verified provider check function
CREATE OR REPLACE FUNCTION is_verified_provider()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'provider'
    AND is_verified = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create triggers for updated_at columns
-- 6.1 Profiles trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at
            BEFORE UPDATE ON profiles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 6.2 Services trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_services_updated_at') THEN
        CREATE TRIGGER update_services_updated_at
            BEFORE UPDATE ON services
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 6.3 Bookings trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
        CREATE TRIGGER update_bookings_updated_at
            BEFORE UPDATE ON bookings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 6.4 Verification requests trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_verification_requests_updated_at') THEN
        CREATE TRIGGER update_verification_requests_updated_at
            BEFORE UPDATE ON verification_requests
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 7. Enable RLS and create policies
-- 7.1 Enable RLS on all tables
DO $$
BEGIN
    -- Enable RLS on profiles if not already enabled
    EXECUTE 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE services ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE bookings ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE reviews ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN OTHERS THEN
    -- Do nothing if RLS is already enabled
    RAISE NOTICE 'Error enabling RLS: %', SQLERRM;
END $$;

-- 7.2 Profiles policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    
    -- Create policies
    CREATE POLICY "Users can view own profile"
        ON profiles FOR SELECT
        USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile"
        ON profiles FOR UPDATE
        USING (auth.uid() = id);
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile policies: %', SQLERRM;
END $$;

-- 7.3 Services policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Anyone can view services" ON services;
    DROP POLICY IF EXISTS "Admins can manage services" ON services;
    
    CREATE POLICY "Anyone can view services"
        ON services FOR SELECT
        USING (true);

    CREATE POLICY "Admins can manage services"
        ON services
        USING (is_admin());
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating services policies: %', SQLERRM;
END $$;

-- 7.4 Provider services policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Anyone can view provider services" ON provider_services;
    DROP POLICY IF EXISTS "Providers can manage own services" ON provider_services;
    
    CREATE POLICY "Anyone can view provider services"
        ON provider_services FOR SELECT
        USING (true);

    CREATE POLICY "Providers can manage own services"
        ON provider_services
        USING (auth.uid() = provider_id OR is_admin());
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating provider services policies: %', SQLERRM;
END $$;

-- 7.5 Bookings policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
    
    CREATE POLICY "Users can view own bookings"
        ON bookings FOR SELECT
        USING (
            auth.uid() = customer_id OR
            auth.uid() = provider_id OR
            is_admin()
        );

    CREATE POLICY "Users can create bookings"
        ON bookings FOR INSERT
        WITH CHECK (auth.uid() = customer_id);

    CREATE POLICY "Users can update own bookings"
        ON bookings FOR UPDATE
        USING (
            auth.uid() = customer_id OR
            auth.uid() = provider_id OR
            is_admin()
        );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating bookings policies: %', SQLERRM;
END $$;

-- 7.6 Reviews policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
    DROP POLICY IF EXISTS "Users can create reviews for own bookings" ON reviews;
    
    CREATE POLICY "Anyone can view reviews"
        ON reviews FOR SELECT
        USING (true);

    CREATE POLICY "Users can create reviews for own bookings"
        ON reviews FOR INSERT
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM bookings
                WHERE bookings.id = booking_id
                AND (
                    bookings.customer_id = auth.uid() OR
                    bookings.provider_id = auth.uid()
                )
            )
        );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating reviews policies: %', SQLERRM;
END $$;

-- 7.7 Verification requests policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Providers can view own verification requests" ON verification_requests;
    DROP POLICY IF EXISTS "Providers can create verification requests" ON verification_requests;
    DROP POLICY IF EXISTS "Admins can update verification requests" ON verification_requests;
    
    CREATE POLICY "Providers can view own verification requests"
        ON verification_requests FOR SELECT
        USING (auth.uid() = provider_id OR is_admin());

    CREATE POLICY "Providers can create verification requests"
        ON verification_requests FOR INSERT
        WITH CHECK (auth.uid() = provider_id);

    CREATE POLICY "Admins can update verification requests"
        ON verification_requests FOR UPDATE
        USING (is_admin());
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating verification requests policies: %', SQLERRM;
END $$;

-- 7.8 Admin audit log policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Only admins can view audit logs" ON admin_audit_log;
    DROP POLICY IF EXISTS "Only admins can create audit logs" ON admin_audit_log;
    
    CREATE POLICY "Only admins can view audit logs"
        ON admin_audit_log FOR SELECT
        USING (is_admin());

    CREATE POLICY "Only admins can create audit logs"
        ON admin_audit_log FOR INSERT
        WITH CHECK (is_admin());
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating admin audit log policies: %', SQLERRM;
END $$;
