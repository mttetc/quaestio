"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { InsightsView } from "@/components/insights/insights-view";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageProps } from "@/lib/types/components";
import { prefetchMetricsData } from "@/lib/features/analytics/utils/prefetch";

export default async function InsightsPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();
    
    // Prefetch metrics data
    await prefetchMetricsData(queryClient);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                    <InsightsView className="p-8" />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}
