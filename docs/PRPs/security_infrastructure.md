# Security & Infrastructure PRP

## Goal
Implement comprehensive security infrastructure and production-ready setup for the Tapstead platform.

## Why
- Protect sensitive user and business data
- Ensure secure service delivery operations
- Enable safe financial transactions
- Meet compliance requirements
- Establish production-grade infrastructure
- Support scalable operations

## What
1. Security Layer:
   - Server-side authorization system
   - Ownership verification
   - Admin function protection
   - API security
   - Error tracking

2. Production Infrastructure:
   - Environment configuration management
   - Webhook infrastructure
   - Database security
   - Monitoring systems
   - Development workflow

### Success Criteria
- [ ] All endpoints protected with proper authorization
- [ ] Ownership verification active on all operations
- [ ] Admin functions secured with role-based access
- [ ] Error tracking capturing 100% of server errors
- [ ] Environment variables properly configured
- [ ] Webhook infrastructure tested and secure
- [ ] Database policies implemented
- [ ] Monitoring systems active
- [ ] Security tests passing with >90% coverage

## All Needed Context

### Documentation & References
```yaml
- url: https://nextjs.org/docs/authentication
  why: Next.js authentication patterns

- url: https://next-auth.js.org/configuration/callbacks
  why: Auth callback configuration

- url: https://docs.sentry.io/platforms/javascript/guides/nextjs/
  why: Sentry setup for error tracking

- url: https://stripe.com/docs/security
  why: Payment security requirements

- url: https://supabase.com/docs/guides/auth/row-level-security
  why: Database security policies
```

### Environment Variables Structure
```bash
# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# Database (Supabase)
DATABASE_URL=
DIRECT_URL=

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=
NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM=

# Application
NEXT_PUBLIC_APP_URL=
WEBHOOK_SECRET=

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email
RESEND_API_KEY=
```

### Known Gotchas
```typescript
// CRITICAL: NextAuth.js session handling requires proper middleware setup
// CRITICAL: API routes must implement rate limiting
// CRITICAL: Stripe webhooks require signature verification
// CRITICAL: Admin routes need role verification in getServerSideProps
// CRITICAL: Supabase RLS policies must be enabled on all tables
// CRITICAL: Webhook endpoints need signature validation
```

## Implementation Blueprint

### Data Models
```typescript
interface Session {
  user: {
    id: string;
    email: string;
    role: UserRole;
    permissions: string[];
  }
}

enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin'
}

// Database Policies
interface DatabasePolicies {
  profiles: RLSPolicy[];
  bookings: RLSPolicy[];
  subscriptions: RLSPolicy[];
  payments: RLSPolicy[];
}
```

### Tasks
```yaml
Task 1 - Environment Configuration:
  - Create .env.template
  - Implement environment validation
  - Setup development/production configs
  - Add build-time validation

Task 2 - Server-side Security:
  - Implement middleware/auth.ts
  - Add role-based access control
  - Create permission system
  - Add rate limiting
  - Setup webhook verification

Task 3 - Database Security:
  - Enable RLS on all tables
  - Implement ownership policies
  - Setup connection pooling
  - Create migration strategy

Task 4 - API Security:
  - Add input validation
  - Implement request sanitization
  - Add CORS configuration
  - Setup rate limiting
  - Implement webhook endpoints

Task 5 - Payment Security:
  - Setup Stripe webhook handling
  - Implement payment monitoring
  - Add subscription management
  - Create payment error handling

Task 6 - Monitoring Setup:
  - Setup Sentry integration
  - Implement error tracking
  - Add payment monitoring
  - Create alert system

Task 7 - Development Workflow:
  - Create setup script
  - Implement pre-deployment checks
  - Add local webhook testing
  - Setup ngrok configuration
```

### Database Security Implementation
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Providers can view assigned jobs" ON bookings
  FOR SELECT USING (provider_id = auth.uid() OR customer_id = auth.uid());
```

### Validation Loop

#### Level 1: Syntax & Style
```bash
npm run lint
npm run typecheck
```

#### Level 2: Unit Tests
```typescript
describe('Security Infrastructure', () => {
  test('environment validation', () => {
    expect(validateEnvironment()).toBeTruthy()
  })
  
  test('webhook verification', async () => {
    const result = await verifyWebhook(payload, signature)
    expect(result).toBeTruthy()
  })
  
  test('database policies', async () => {
    const { data, error } = await testDatabasePolicies()
    expect(error).toBeNull()
  })
})
```

#### Level 3: Integration Tests
```bash
# Test protected endpoint
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer ${TOKEN}"

# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "stripe-signature: ${SIGNATURE}" \
  -d "${PAYLOAD}"

# Test database policies
npm run test:db-policies
```

### Pre-deployment Checklist
```typescript
const preDeployCheck = async () => {
  // Test database connection
  await testDatabaseConnection()
  
  // Validate environment variables
  validateEnvironmentVariables()
  
  // Test Stripe connection
  await testStripeConnection()
  
  // Test webhook endpoints
  await testWebhookEndpoints()
  
  // Verify security policies
  await verifySecurityPolicies()
}
```

## Final Checklist
- [ ] Environment configuration complete
- [ ] Auth middleware tests passing
- [ ] Database policies implemented and tested
- [ ] Webhook infrastructure configured
- [ ] Payment security measures active
- [ ] Monitoring systems configured
- [ ] Development workflow tested
- [ ] Security tests passing
- [ ] Documentation updated