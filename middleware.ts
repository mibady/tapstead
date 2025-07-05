import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { RATE_LIMIT_CONFIG } from "./lib/config/constants"

// In-memory stores for rate limiting. 
// NOTE: In a production, distributed environment, use a shared store like Redis.
interface RateLimitEntry {
  count: number;
  timestamp: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Routes that require CSRF protection for mutating methods
const csrfProtectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

// Routes that have stricter rate limits
const sensitiveApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset-password',
];

// Define route access patterns
type RouteAccess = {
  pattern: RegExp
  requiredRole?: 'customer' | 'provider' | 'admin' | null // null means authenticated but no specific role
}

const protectedRoutes: RouteAccess[] = [
    { pattern: /^\/dashboard($|\/)/i, requiredRole: null }, // Any authenticated user
    { pattern: /^\/admin($|\/)/i, requiredRole: 'admin' },
    { pattern: /^\/provider($|\/)/i, requiredRole: 'provider' },
    { pattern: /^\/book-now($|\/)/i, requiredRole: null },
    { pattern: /^\/api\/protected($|\/)/i, requiredRole: null }
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1. Apply Rate Limiting
  const rateLimitResponse = applyRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // 2. Handle CSRF Protection
  // Generate and set token on the response for the client to use
  let csrfToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!csrfToken) {
    csrfToken = crypto.randomUUID();
    res.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      path: '/',
      httpOnly: false, // Must be false for client-side script to read it
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  // Validate token for protected methods
  if (csrfProtectedMethods.includes(req.method)) {
    const csrfValidationResponse = validateCsrfToken(req, csrfToken);
    if (csrfValidationResponse) {
      return csrfValidationResponse;
    }
  }

  // 3. Handle Authentication and Authorization
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  
    // Redirect authenticated users from /auth to dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  const matchedRoute = protectedRoutes.find(route => route.pattern.test(req.nextUrl.pathname));
  
  if (matchedRoute) {
    // User is not authenticated, redirect to auth page
    if (!session) {
      const redirectUrl = new URL('/auth', req.url);
      const redirectTo = `${req.nextUrl.pathname}${req.nextUrl.search}`;
      redirectUrl.searchParams.set('redirect_to', redirectTo);
      return NextResponse.redirect(redirectUrl);
    }
    
    // User is authenticated, check for role-based authorization
    if (matchedRoute.requiredRole) {
      // Prefer role from the JWT claims if available
      const userRole = session.user.app_metadata?.role || session.user.user_metadata?.role;
      if (userRole === matchedRoute.requiredRole) {
        return res; // Authorized
      }

      // As a fallback, check the database
      const { data: profile } = await supabase
        .from('users')
        .select('customer_type')
        .eq('id', session.user.id)
        .single();

      if (profile?.customer_type !== matchedRoute.requiredRole) {
        // Role does not match, redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }

  // 4. Set Security Headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co https://api.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com"
  );
  
  return res;
}

function applyRateLimit(req: NextRequest): NextResponse | null {
  if (req.nextUrl.pathname.match(/\.(css|js|jpg|png|svg|ico|gif|woff|woff2)$/)) {
    return null; // Skip static assets
  }

    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
  
  const isSensitive = sensitiveApiRoutes.some(p => req.nextUrl.pathname.startsWith(p));
  const limit = isSensitive 
    ? RATE_LIMIT_CONFIG.SENSITIVE_ENDPOINTS_MAX_REQUESTS 
    : RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_MINUTE;

  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (entry && now - entry.timestamp < RATE_LIMIT_CONFIG.RATE_LIMIT_DURATION) {
    entry.count++;
    if (entry.count > limit) {
      const response = NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      response.headers.set('Retry-After', String(RATE_LIMIT_CONFIG.RATE_LIMIT_DURATION / 1000));
      return response;
    }
  } else {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
  }
  
  return null;
}

function validateCsrfToken(req: NextRequest, csrfFromCookie: string | undefined): NextResponse | null {
  // Skip validation for auth routes that handle their own CSRF or use other mechanisms
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return null;
  }

  const csrfFromHeader = req.headers.get(CSRF_HEADER_NAME);
  
  if (!csrfFromHeader || !csrfFromCookie || csrfFromHeader !== csrfFromCookie) {
    console.warn(`CSRF validation failed for ${req.method} ${req.nextUrl.pathname}. Header: ${csrfFromHeader}, Cookie: ${csrfFromCookie}`);
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  
  return null;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
