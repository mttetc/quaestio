"use client";

import { Suspense } from "react";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useRouter } from "next/navigation";
import { ViewProps } from "@/lib/types/components";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadUser } from "@/lib/features/auth/hooks/use-read-user";
import { useReadEmailAccounts } from "@/lib/features/email/hooks/use-read-accounts";

export function DashboardOverview({ className }: ViewProps) {
    const router = useRouter();
    const { data: user } = useReadUser();
    const { data: emailAccounts } = useReadEmailAccounts();
    const isLoading = !user || !emailAccounts;

    // Handle onboarding redirect
    if (user && !user.hasCompletedOnboarding && !emailAccounts?.length) {
        router.push("/onboarding");
        return null;
    }

    return (
        <div className={`space-y-6 ${className ?? ""}`}>
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">
                    {isLoading ? <Skeleton className="h-4 w-48" /> : "Welcome to your Q&A management dashboard"}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Suspense fallback={<DashboardCardSkeleton />}>
                    <QuickActions />
                </Suspense>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold mb-2">Recent Activity</h3>
                    <Suspense fallback={<DashboardCardSkeleton />}>
                        <RecentActivity />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

function DashboardCardSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
        </div>
    );
}
