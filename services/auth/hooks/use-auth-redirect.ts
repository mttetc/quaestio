"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./use-user";
import { checkEmailLinkingStatus } from "@/lib/core/auth/email-linking";

export function useAuthRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: user, isLoading } = useUser();

    useEffect(() => {
        async function checkAndRedirect() {
            if (!user) {
                // If no user and not on auth pages, redirect to login
                if (!["/login", "/signup"].includes(pathname)) {
                    router.push("/login");
                }
                return;
            }

            // If user exists and on auth pages, redirect to dashboard
            if (["/login", "/signup"].includes(pathname)) {
                router.push("/dashboard");
                return;
            }

            try {
                const { hasLinkedEmail } = await checkEmailLinkingStatus(user.id);

                // If user has no linked email and not on onboarding, redirect to onboarding
                if (!hasLinkedEmail && pathname !== "/onboarding") {
                    router.push("/onboarding");
                    return;
                }

                // If user has linked email and on onboarding page, redirect to dashboard
                if (hasLinkedEmail && pathname === "/onboarding") {
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Failed to check email linking status:", error);
            }
        }

        if (!isLoading) {
            checkAndRedirect();
        }
    }, [user, isLoading, router, pathname]);

    return { isLoading };
}
