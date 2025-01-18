"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary, useQueryClient } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { readEmailAccounts } from "@/lib/features/email/queries/readEmailAccounts";
import { readSubscriptions } from "@/lib/features/email/queries/readSubscriptions";
import { PageProps } from "@/lib/types/components";

export default function DashboardPage({ params, searchParams }: PageProps) {
    const queryClient = useQueryClient();

    // Prefetch all dashboard data in parallel
    queryClient.prefetchQuery({
        queryKey: ["user"],
        queryFn: () => readUser(),
    });

    queryClient.prefetchQuery({
        queryKey: ["email-accounts"],
        queryFn: () => readEmailAccounts(),
    });

    queryClient.prefetchQuery({
        queryKey: ["subscriptions"],
        queryFn: () => readSubscriptions(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex justify-center p-8">Loading dashboard...</div>}>
                    <DashboardOverview />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}
