import { NextResponse, type NextRequest } from "next/server";
import { isPublicRoute, isPrivateRoute } from "./lib/constants/routes";

// In-memory store for rate limiting
// In production, use Redis or similar for distributed systems
const rateLimit = new Map();

// Configure rate limit
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // requests per window

if (!process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF) {
    throw new Error("NEXT_PUBLIC_SUPABASE_PROJECT_REF is not set");
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for Supabase auth endpoints
    if (pathname.includes("/auth/v1/")) {
        return NextResponse.next();
    }

    // Check if user is authenticated via cookie
    const hasAuthCookie = request.cookies.has(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}-auth-token`);

    // Handle routing based on auth status
    if (hasAuthCookie) {
        // Authenticated users shouldn't access public routes
        if (isPublicRoute(pathname)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    } else {
        // Non-authenticated users shouldn't access private routes
        if (isPrivateRoute(pathname)) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // API routes always require authentication
    if (pathname.startsWith("/api/") && !hasAuthCookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Rate Limiting (only for API routes)
    if (pathname.startsWith("/api")) {
        const clientId = request.headers.get("x-forwarded-for") ?? "anonymous";
        const now = Date.now();
        const windowStart = now - RATE_LIMIT_WINDOW;

        // Clean up old entries
        for (const [key, timestamp] of rateLimit.entries()) {
            if (timestamp < windowStart) {
                rateLimit.delete(key);
            }
        }

        // Count requests in current window
        const requestCount = Array.from(rateLimit.entries()).filter(
            ([key, timestamp]) => key.startsWith(clientId) && timestamp > windowStart
        ).length;

        if (requestCount >= MAX_REQUESTS) {
            return new NextResponse("Too Many Requests", {
                status: 429,
                headers: {
                    "Retry-After": String(RATE_LIMIT_WINDOW / 1000),
                },
            });
        }

        // Store this request
        rateLimit.set(`${clientId}-${now}`, now);

        // Add rate limit headers
        response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
        response.headers.set("X-RateLimit-Remaining", String(MAX_REQUESTS - requestCount - 1));
        response.headers.set("X-RateLimit-Reset", String(Math.ceil(windowStart / 1000)));
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
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
