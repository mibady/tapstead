# Authentication System Documentation

## Overview
The authentication system provides role-based access control, provider verification, and audit logging.

## Roles
- `customer`: Basic user role
- `provider`: Service provider role
- `admin`: Administrative role

## Role Management
- Admin role can only be granted by existing admins
- Role changes are tracked with previous_roles array
- Role grants are logged with granter and timestamp

## Provider Verification
Verification Types:
- `initial`: First-time verification
- `renewal`: Periodic renewal
- `additional_service`: Adding new service types

Requirements:
1. Background check consent
2. License verification
3. Insurance verification
4. Reference checks

## Security Features
1. Row Level Security (RLS) on all tables
2. Role-based access control
3. Comprehensive audit logging
4. IP and user agent tracking

## Audit Logging
Severity Levels:
- `info`: Normal operations
- `warning`: Suspicious activity
- `error`: Security violations
- `critical`: System integrity issues

## Provider Specializations
- Track experience by service type
- Store certification information
- Mark primary specializations

## Database Indexes
Optimized for:
- Role + verification status queries
- Verification request lookups
- Audit log searching
- Provider specialization filtering

## Helper Functions
- `is_admin()`: Check admin status (cached)
- `is_verified_provider()`: Check provider verification
- `check_verification_requirements()`: Verify all requirements met

## Testing
Run tests with:
```sql
psql -f supabase/tests/auth.test.sql
```

Test coverage:
- Role-based access control
- Verification workflow
- Audit logging
- Property-based role tests