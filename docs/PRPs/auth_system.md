# Authentication System PRP

## Goal
Implement comprehensive authentication system using Supabase Auth with role-based access control.

## Why
- Secure user authentication
- Role-based access control
- Provider verification
- Admin capabilities
- Session management

## What
1. Authentication:
   - Email/password login
   - Provider verification
   - Admin access control
   - Session management

### Success Criteria
- [ ] User authentication working
- [ ] Role-based access implemented
- [ ] Provider verification active
- [ ] Admin controls functional

## Implementation

### Database Schema (Supabase)
```sql
-- Enable auth schema
create schema if not exists auth;

-- Extend auth.users with profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role user_role not null default 'customer',
  email text unique not null,
  full_name text,
  phone text,
  is_verified boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- RLS Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Admin access policy
create policy "Admins have full access"
  on profiles
  using ( auth.jwt() ->> 'role' = 'admin' );
```

### Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Auth Provider
```typescript
// components/providers/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export const AuthContext = createContext<{
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and subscribe to changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Protected Routes
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect routes based on auth status
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based access control
  if (
    session?.user.role !== 'admin' &&
    req.nextUrl.pathname.startsWith('/admin')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}
```

### Login Component
```typescript
// components/auth/LoginForm.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function LoginForm() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Admin Authorization
```typescript
// lib/auth/checkAdmin.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkAdmin() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  return session;
}

// Usage in admin pages
// app/admin/page.tsx
export default async function AdminPage() {
  const session = await checkAdmin();
  // Render admin content
}
```

### Validation Loop

#### Level 1: Syntax & Style
```bash
npm run lint
npm run typecheck
```

#### Level 2: Unit Tests
```typescript
describe('Auth System', () => {
  test('handles login', async () => {
    const { user } = await loginUser('test@example.com', 'password');
    expect(user).toBeDefined();
  });

  test('protects admin routes', async () => {
    const { user } = await loginUser('user@example.com', 'password');
    const response = await fetch('/admin');
    expect(response.status).toBe(403);
  });
});
```

#### Level 3: Integration Tests
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'

# Test protected route
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

## Final Checklist
- [ ] Authentication working
- [ ] Role-based access tested
- [ ] Protected routes secured
- [ ] Admin controls tested
- [ ] Error handling complete
- [ ] Documentation updated