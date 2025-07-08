-- Improve role management
ALTER TABLE profiles
ADD COLUMN role_granted_by uuid REFERENCES profiles(id),
ADD COLUMN role_granted_at timestamptz,
ADD COLUMN previous_roles user_role[] DEFAULT ARRAY[]::user_role[],
ADD CONSTRAINT valid_role_grant CHECK (
  (role != 'admin' AND role_granted_by IS NULL) OR
  (role = 'admin' AND role_granted_by IS NOT NULL)
);

-- Improve verification system
ALTER TABLE verification_requests
ADD COLUMN verification_type TEXT NOT NULL DEFAULT 'initial'
  CHECK (verification_type IN ('initial', 'renewal', 'additional_service')),
ADD COLUMN expiration_date timestamptz,
ADD COLUMN required_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN verification_checklist JSONB DEFAULT '{
  "background_check": false,
  "license_verified": false,
  "insurance_verified": false,
  "references_checked": false
}'::jsonb;

-- Enhance audit logging
ALTER TABLE admin_audit_log
ADD COLUMN severity TEXT NOT NULL DEFAULT 'info'
  CHECK (severity IN ('info', 'warning', 'error', 'critical')),
ADD COLUMN related_entity_type TEXT,
ADD COLUMN related_entity_id uuid,
ADD COLUMN ip_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN user_agent TEXT;

-- Add provider specialization tracking
CREATE TABLE provider_specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  years_experience INTEGER NOT NULL CHECK (years_experience >= 0),
  certification_info JSONB DEFAULT '{}'::jsonb,
  is_primary BOOLEAN DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE (provider_id, service_type)
);

-- Add indexes for improved query performance
CREATE INDEX idx_profiles_role_verified ON profiles (role, is_verified);
CREATE INDEX idx_verification_requests_type_status ON verification_requests (verification_type, status);
CREATE INDEX idx_admin_audit_log_severity ON admin_audit_log (severity, created_at);
CREATE INDEX idx_provider_specializations_type ON provider_specializations (service_type, is_primary);

-- Add RLS policies for new table
ALTER TABLE provider_specializations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can manage their specializations"
  ON provider_specializations
  USING (auth.uid() = provider_id OR is_admin());

-- Add helper functions for verification workflow
CREATE OR REPLACE FUNCTION check_verification_requirements(request_id uuid)
RETURNS boolean AS $$
DECLARE
  req verification_requests;
  all_requirements_met boolean;
BEGIN
  SELECT * INTO req FROM verification_requests WHERE id = request_id;
  
  -- Check all verification requirements
  SELECT bool_and(value::boolean)
  INTO all_requirements_met
  FROM jsonb_each_text(req.verification_checklist);
  
  RETURN all_requirements_met;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Improve admin check function with caching
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
DECLARE
  result boolean;
BEGIN
  -- Check cache first (implement caching mechanism here if needed)
  -- For now, just check the database
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND is_verified = true
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;