"use client";

import { QueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { readResponseTimeMetrics, readVolumeMetrics, readQualityMetrics } from "../queries/readMetrics";
import { DEFAULT_DATE_RANGE } from "../hooks/use-date-range";

export async function prefetchMetricsData(queryClient: QueryClient, dateRange: DateRange = DEFAULT_DATE_RANGE) {
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["metrics", "response", dateRange],
            queryFn: () => readResponseTimeMetrics(dateRange),
            staleTime: 5 * 60 * 1000, // 5 minutes
        }),
        queryClient.prefetchQuery({
            queryKey: ["metrics", "volume", dateRange],
            queryFn: () => readVolumeMetrics(dateRange),
            staleTime: 5 * 60 * 1000,
        }),
        queryClient.prefetchQuery({
            queryKey: ["metrics", "quality", dateRange],
            queryFn: () => readQualityMetrics(dateRange),
            staleTime: 5 * 60 * 1000,
        }),
    ]);
}
