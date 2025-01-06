import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./services/supabase/server";

// Protected routes that require authentication
const protectedPaths = [
    "/api/analytics",
    "/api/qa",
    "/api/email",
    "/api/user",
    "/api/exports",
    "/api/integrations",
    "/api/analysis",
    "/dashboard",
    "/settings",
    "/docs",
];

// In-memory store for rate limiting
// In production, use Redis or similar for distributed systems
const rateLimit = new Map();

// Configure rate limit
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // requests per window

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 1. Authentication Check
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Check if the request is for a protected route
    const isProtectedRoute = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    if (isProtectedRoute && !session) {
        // Redirect to login for pages, return 401 for API routes
        if (request.nextUrl.pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Rate Limiting (only for API routes)
    if (request.nextUrl.pathname.startsWith("/api")) {
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
