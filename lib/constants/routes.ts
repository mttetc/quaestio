export const PUBLIC_ROUTES = ["/", "/login", "/signup"] as const;

export const PRIVATE_ROUTES = [
    "/dashboard",
    "/dashboard/extract",
    "/dashboard/qa",
    "/dashboard/qa/create",
    "/dashboard/knowledge/export",
    "/dashboard/knowledge/docs",
    "/dashboard/insights",
    "/dashboard/insights/analysis",
    "/dashboard/settings",
    "/dashboard/subscriptions",
    "/onboarding",
] as const;

export const isPublicRoute = (path: string) => {
    return PUBLIC_ROUTES.includes(path as any) || path.startsWith("/auth/callback"); // Special case for auth callback
};

export const isPrivateRoute = (path: string) => {
    return PRIVATE_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
};
