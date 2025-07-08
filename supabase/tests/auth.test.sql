-- Auth System Test Suite
BEGIN;

-- Test helper to create test users
CREATE OR REPLACE FUNCTION create_test_user(
  role user_role,
  verified boolean DEFAULT false
) RETURNS uuid AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := gen_random_uuid();
  INSERT INTO auth.users (id, email) VALUES (user_id, 'test-' || user_id || '@test.com');
  INSERT INTO profiles (id, role, email, is_verified)
  VALUES (user_id, role, 'test-' || user_id || '@test.com', verified);
  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- Test Cases

-- Test 1: Role-based Access Control
DO $$ 
DECLARE
  customer_id uuid;
  provider_id uuid;
  admin_id uuid;
  service_id uuid;
BEGIN
  -- Create test users
  customer_id := create_test_user('customer');
  provider_id := create_test_user('provider', true);
  admin_id := create_test_user('admin');

  -- Create test service
  INSERT INTO services (id, name, type, description, base_price)
  VALUES (gen_random_uuid(), 'Test Service', 'other', 'Test', 100)
  RETURNING id INTO service_id;

  -- Test admin check function
  ASSERT NOT is_admin(), 
    'Non-authenticated user should not be admin';

  -- Set auth context to admin
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub TO admin_id::text;

  ASSERT is_admin(), 
    'Admin user should be identified as admin';

  -- Test provider verification
  SET LOCAL request.jwt.claim.sub TO provider_id::text;
  ASSERT is_verified_provider(), 
    'Verified provider should be identified as verified';

  -- Test RLS policies
  SET LOCAL request.jwt.claim.sub TO customer_id::text;
  
  -- Customers should see services
  ASSERT EXISTS (
    SELECT 1 FROM services WHERE id = service_id
  ), 'Customer should be able to view services';

  -- But not modify them
  BEGIN
    UPDATE services SET name = 'Modified' WHERE id = service_id;
    RAISE EXCEPTION 'Should not be able to update services as customer';
  EXCEPTION WHEN insufficient_privilege THEN
    -- Expected
  END;
END $$;

-- Test 2: Verification System
DO $$
DECLARE
  provider_id uuid;
  admin_id uuid;
  request_id uuid;
BEGIN
  provider_id := create_test_user('provider');
  admin_id := create_test_user('admin');

  -- Set auth context to provider
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub TO provider_id::text;

  -- Provider should be able to submit verification request
  INSERT INTO verification_requests (
    provider_id, 
    submitted_data
  ) VALUES (
    provider_id,
    '{"license": "TEST-123"}'::jsonb
  ) RETURNING id INTO request_id;

  -- But not approve it
  BEGIN
    UPDATE verification_requests 
    SET status = 'approved' 
    WHERE id = request_id;
    RAISE EXCEPTION 'Provider should not be able to approve own request';
  EXCEPTION WHEN insufficient_privilege THEN
    -- Expected
  END;

  -- Admin should be able to approve
  SET LOCAL request.jwt.claim.sub TO admin_id::text;
  UPDATE verification_requests 
  SET status = 'approved',
      processed_by = admin_id,
      processed_at = now()
  WHERE id = request_id;

  -- Should create audit log
  ASSERT EXISTS (
    SELECT 1 FROM admin_audit_log 
    WHERE action = 'approve_verification'
    AND target_user = provider_id
  ), 'Should create audit log for verification approval';
END $$;

-- Test 3: Audit Logging
DO $$
DECLARE
  admin_id uuid;
  customer_id uuid;
BEGIN
  admin_id := create_test_user('admin');
  customer_id := create_test_user('customer');

  -- Set auth context to admin
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub TO admin_id::text;

  -- Admin should be able to create audit logs
  INSERT INTO admin_audit_log (
    action,
    performed_by,
    target_user,
    details
  ) VALUES (
    'test_action',
    admin_id,
    customer_id,
    '{"test": true}'::jsonb
  );

  -- Non-admin should not see audit logs
  SET LOCAL request.jwt.claim.sub TO customer_id::text;
  ASSERT NOT EXISTS (
    SELECT 1 FROM admin_audit_log
  ), 'Customer should not see audit logs';
END $$;

-- Test 4: Property-based Tests for Role System
DO $$
DECLARE
  roles user_role[] := ARRAY['customer', 'provider', 'admin'];
  r user_role;
  test_user_id uuid;
BEGIN
  FOREACH r IN ARRAY roles LOOP
    -- Create user with role
    test_user_id := create_test_user(r);
    
    -- Set auth context
    SET LOCAL ROLE authenticated;
    SET LOCAL request.jwt.claim.sub TO test_user_id::text;

    -- Test role properties
    CASE r
      WHEN 'admin' THEN
        ASSERT is_admin(), 
          'Admin user should have admin privileges';
      WHEN 'provider' THEN
        ASSERT NOT is_admin(), 
          'Provider should not have admin privileges';
      WHEN 'customer' THEN
        ASSERT NOT is_admin() AND NOT is_verified_provider(),
          'Customer should have neither admin nor provider privileges';
    END CASE;
  END LOOP;
END $$;

ROLLBACK;