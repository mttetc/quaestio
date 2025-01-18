"use client";

import { useQueries, useSuspenseQuery, useSuspenseQueries } from "@tanstack/react-query";
import {
    readResponseTimeMetrics,
    readVolumeMetrics,
    readQualityMetrics,
} from "@/lib/features/analytics/queries/readMetrics";
import type { ResponseMetrics, VolumeMetrics, QualityMetrics } from "@/lib/features/analytics/schemas/metrics";
import { DateRange } from "react-day-picker";

// Cache time configurations
const METRICS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const METRICS_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// Individual metric hooks
export function useReadResponseMetrics(dateRange: DateRange | undefined) {
    return useSuspenseQuery<ResponseMetrics>({
        queryKey: ["metrics", "response", dateRange],
        queryFn: () => readResponseTimeMetrics(dateRange),
        staleTime: METRICS_STALE_TIME,
        gcTime: METRICS_CACHE_TIME,
    });
}

export function useReadVolumeMetrics(dateRange: DateRange | undefined) {
    return useSuspenseQuery<VolumeMetrics>({
        queryKey: ["metrics", "volume", dateRange],
        queryFn: () => readVolumeMetrics(dateRange),
        staleTime: METRICS_STALE_TIME,
        gcTime: METRICS_CACHE_TIME,
    });
}

export function useReadQualityMetrics(dateRange: DateRange | undefined) {
    return useSuspenseQuery<QualityMetrics>({
        queryKey: ["metrics", "quality", dateRange],
        queryFn: () => readQualityMetrics(dateRange),
        staleTime: METRICS_STALE_TIME,
        gcTime: METRICS_CACHE_TIME,
    });
}

// Combined metrics hook for parallel fetching
export function useReadAllMetrics(dateRange: DateRange | undefined) {
    return useSuspenseQueries({
        queries: [
            {
                queryKey: ["metrics", "response", dateRange],
                queryFn: () => readResponseTimeMetrics(dateRange),
                staleTime: METRICS_STALE_TIME,
                gcTime: METRICS_CACHE_TIME,
            },
            {
                queryKey: ["metrics", "volume", dateRange],
                queryFn: () => readVolumeMetrics(dateRange),
                staleTime: METRICS_STALE_TIME,
                gcTime: METRICS_CACHE_TIME,
            },
            {
                queryKey: ["metrics", "quality", dateRange],
                queryFn: () => readQualityMetrics(dateRange),
                staleTime: METRICS_STALE_TIME,
                gcTime: METRICS_CACHE_TIME,
            },
        ],
    });
}
