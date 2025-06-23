-- Enable Row Level Security for quote_requests table
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quote_requests

-- Users can view their own quote requests
CREATE POLICY "Users can view own quote requests" ON quote_requests
  FOR SELECT USING (auth.uid() = customer_id);

-- Users can create their own quote requests
CREATE POLICY "Users can create quote requests" ON quote_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Users can update their own quote requests (limited to certain statuses)
CREATE POLICY "Users can update own quote requests" ON quote_requests
  FOR UPDATE USING (
    auth.uid() = customer_id AND 
    status IN ('pending', 'reviewed') -- Only allow updates for certain statuses
  );

-- Providers can view quote requests assigned to them
CREATE POLICY "Providers can view assigned quote requests" ON quote_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM providers 
      WHERE providers.id = quote_requests.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- Providers can update quote requests assigned to them
CREATE POLICY "Providers can update assigned quote requests" ON quote_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM providers 
      WHERE providers.id = quote_requests.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- Admin role can view all quote requests
CREATE POLICY "Admins can view all quote requests" ON quote_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admin role can update all quote requests
CREATE POLICY "Admins can update all quote requests" ON quote_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
