"use client";

import { Suspense } from "react";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useRouter } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { readEmailAccounts } from "@/lib/features/email/queries/read-email-accounts";
import { ViewProps } from "@/lib/types/components";
import { type User } from "@/lib/features/auth/schemas/user";
import { type EmailAccount } from "@/lib/features/email/schemas/email";

const USER_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const USER_CACHE_TIME = 1000 * 60 * 60; // 1 hour
const ACCOUNTS_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const ACCOUNTS_CACHE_TIME = 1000 * 60 * 60; // 1 hour

export function DashboardOverview({ className }: ViewProps) {
    const router = useRouter();
    
    // Use parallel queries for better performance
    const [{ data: user, isLoading: isLoadingUser }, { data: emailAccounts, isLoading: isLoadingAccounts }] = useQueries({
        queries: [
            {
                queryKey: ["user"],
                queryFn: readUser,
                staleTime: USER_STALE_TIME,
                gcTime: USER_CACHE_TIME,
            },
            {
                queryKey: ["emailAccounts"],
                queryFn: readEmailAccounts,
                staleTime: ACCOUNTS_STALE_TIME,
                gcTime: ACCOUNTS_CACHE_TIME,
            },
        ],
    }) as [{ data: User }, { data: EmailAccount[] }];

    // Handle onboarding redirect
    if (isLoadingUser || isLoadingAccounts) {
        return null;
    }

    if (user && !user.hasCompletedOnboarding && !emailAccounts?.length) {
        router.push("/onboarding");
        return null;
    }

    return (
        <div className={`space-y-6 ${className ?? ""}`}>
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome to your Q&A management dashboard</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Suspense fallback={<div>Loading quick actions...</div>}>
                    <QuickActions />
                </Suspense>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold mb-2">Recent Activity</h3>
                    <Suspense fallback={<div>Loading recent activity...</div>}>
                        <RecentActivity />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
