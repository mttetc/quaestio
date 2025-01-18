"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { InsightsView } from "@/components/insights/insights-view";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { readQualityMetrics, readResponseTimeMetrics, readVolumeMetrics } from "@/lib/features/analytics/queries/readMetrics";
import { PageProps } from "@/lib/types/components";

export default function InsightsPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();

    // Prefetch all metrics in parallel
    queryClient.prefetchQuery({
        queryKey: ["metrics", "quality"],
        queryFn: () => readQualityMetrics(),
    });

    queryClient.prefetchQuery({
        queryKey: ["metrics", "response-time"],
        queryFn: () => readResponseTimeMetrics(),
    });

    queryClient.prefetchQuery({
        queryKey: ["metrics", "volume"],
        queryFn: () => readVolumeMetrics(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex justify-center p-8">Loading insights...</div>}>
                    <InsightsView />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}
