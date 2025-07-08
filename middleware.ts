import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/lib/supabase/types';

// Routes that require authentication and specific roles
const protectedRoutes = {
  '/dashboard': ['customer', 'provider', 'admin'],
  '/admin': ['admin'],
  '/provider': ['provider', 'admin'],
  '/api/admin': ['admin'],
  '/api/provider': ['provider', 'admin'],
} as const;

// Routes that bypass protection (public routes)
const publicRoutes = [
  '/auth',
  '/api/auth',
  '/',
  '/about',
  '/services',
  '/contact',
  '/blog',
  '/terms',
  '/privacy',
  '/favicon.ico',
  '/_next',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Refresh session if exists
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
    return redirectToLogin(req);
  }

  const path = req.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return res;
  }

  // Check if route requires protection
  const requiredRoles = Object.entries(protectedRoutes)
    .find(([route]) => path.startsWith(route))?.[1];

  if (!requiredRoles) {
    return res;
  }

  // No session, redirect to login
  if (!session) {
    return redirectToLogin(req);
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_verified')
    .eq('id', session.user.id)
    .single();

  if (!profile) {
    return redirectToLogin(req);
  }

  // Check role authorization
  if (!requiredRoles.includes(profile.role)) {
    // If user is logged in but unauthorized, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // For provider routes, check verification status
  if (path.startsWith('/provider') && profile.role === 'provider' && !profile.is_verified) {
    return NextResponse.redirect(new URL('/provider/verification', req.url));
  }

  // Add user role to request header for use in API routes
  res.headers.set('x-user-role', profile.role);
  
  return res;
}

function redirectToLogin(req: NextRequest) {
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = '/auth/login';
  redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};