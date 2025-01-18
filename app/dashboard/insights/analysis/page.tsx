"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { WebsiteAnalyzer } from "@/components/analysis/website-analyzer";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { readSentiment, readSentimentHeatmap } from "@/lib/features/analytics/queries/readSentiment";
import { PageProps } from "@/lib/types/components";

export default function AnalysisPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();
    const dateRange = {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
    };

    // Prefetch sentiment data in parallel
    queryClient.prefetchQuery({
        queryKey: ["sentiment", dateRange],
        queryFn: () => readSentiment(dateRange),
    });

    queryClient.prefetchQuery({
        queryKey: ["sentiment-heatmap", dateRange],
        queryFn: () => readSentimentHeatmap(dateRange),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex justify-center p-8">Loading analysis...</div>}>
                    <WebsiteAnalyzer />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}
