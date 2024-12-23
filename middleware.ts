import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const protectedPaths = [
  '/api/analytics',
  '/api/qa',
  '/api/email',
  '/api/user',
  '/api/exports',
  '/api/faq',
  '/api/integrations',
  '/api/analysis',
  '/dashboard',
  '/settings',
  '/docs'
];

// Paths that require completed onboarding
const onboardingRequiredPaths = [
  '/dashboard',
  '/settings',
  '/docs',
  '/api/qa',
  '/api/analytics'
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Check if the request is for a protected route
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !session) {
    // Redirect to login for pages, return 401 for API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check onboarding status for specific routes
  const requiresOnboarding = onboardingRequiredPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (requiresOnboarding && session) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user?.hasCompletedOnboarding) {
      // Redirect to onboarding for pages, return 403 for API routes
      if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Onboarding required' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/onboarding/email', request.url));
    }
  }

  return response;
}

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