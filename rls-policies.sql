-- Enable Row-Level Security (RLS) for all relevant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can view their own bookings, and providers can view assigned bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users and providers can update bookings" ON bookings;
DROP POLICY IF EXISTS "Provider profiles are public" ON providers;
DROP POLICY IF EXISTS "Providers can update their own profile" ON providers;
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users and providers can view tracking data" ON tracking;
DROP POLICY IF EXISTS "Providers can update tracking data" ON tracking;

-- RLS Policies for 'users' table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS Policies for 'bookings' table
CREATE POLICY "Users can view their own bookings, and providers can view assigned bookings" ON bookings
  FOR SELECT USING (
    (auth.uid() = user_id) OR 
    (EXISTS (SELECT 1 FROM providers WHERE providers.id = bookings.provider_id AND providers.user_id = auth.uid()))
  );

CREATE POLICY "Authenticated users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and providers can update bookings" ON bookings
  FOR UPDATE USING (
    (auth.uid() = user_id) OR 
    (EXISTS (SELECT 1 FROM providers WHERE providers.id = bookings.provider_id AND providers.user_id = auth.uid()))
  );

-- RLS Policies for 'providers' table
CREATE POLICY "Provider profiles are public" ON providers
  FOR SELECT USING (true);

CREATE POLICY "Providers can update their own profile" ON providers
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for 'subscriptions' table
CREATE POLICY "Users can manage their own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for 'tracking' table
CREATE POLICY "Users and providers can view tracking data" ON tracking
  FOR SELECT USING (
    (EXISTS (SELECT 1 FROM bookings WHERE bookings.id = tracking.booking_id AND bookings.user_id = auth.uid())) OR
    (EXISTS (SELECT 1 FROM providers WHERE providers.id = tracking.provider_id AND providers.user_id = auth.uid()))
  );

CREATE POLICY "Providers can update tracking data" ON tracking
  FOR ALL USING (
    EXISTS (SELECT 1 FROM providers WHERE providers.id = tracking.provider_id AND providers.user_id = auth.uid())
  );
