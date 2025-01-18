"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import type { DateRange } from "@/components/ui/calendar";
import {
    readResponseTimeMetrics,
    readVolumeMetrics,
    readQualityMetrics,
} from "@/lib/features/analytics/queries/readMetrics";
import type { ResponseMetrics, VolumeMetrics, QualityMetrics } from "@/lib/features/analytics/schemas/metrics";

// Cache time configurations
const METRICS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const METRICS_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// Individual metric hooks
export function useReadResponseMetrics(dateRange: DateRange | undefined) {
    return useQuery<ResponseMetrics>({
        queryKey: ["metrics", "response", dateRange],
        queryFn: () => readResponseTimeMetrics(dateRange!),
        staleTime: METRICS_STALE_TIME,
        gcTime: METRICS_CACHE_TIME,
        enabled: !!dateRange,
    });
}

export function useReadVolumeMetrics(dateRange: DateRange | undefined) {
    return useQuery<VolumeMetrics>({
        queryKey: ["metrics", "volume", dateRange],
        queryFn: () => readVolumeMetrics(dateRange!),
        staleTime: METRICS_STALE_TIME,
        gcTime: METRICS_CACHE_TIME,
        enabled: !!dateRange,
    });
}

export function useReadQualityMetrics(dateRange: DateRange | undefined) {
    return useQuery<QualityMetrics>({
        queryKey: ["metrics", "quality", dateRange],
        queryFn: () => readQualityMetrics(dateRange!),
        staleTime: METRICS_STALE_TIME,
        gcTime: METRICS_CACHE_TIME,
        enabled: !!dateRange,
    });
}

// Combined metrics hook for parallel fetching
export function useReadAllMetrics(dateRange: DateRange | undefined) {
    return useQueries({
        queries: [
            {
                queryKey: ["metrics", "response", dateRange],
                queryFn: () => readResponseTimeMetrics(dateRange!),
                staleTime: METRICS_STALE_TIME,
                gcTime: METRICS_CACHE_TIME,
                enabled: !!dateRange,
            },
            {
                queryKey: ["metrics", "volume", dateRange],
                queryFn: () => readVolumeMetrics(dateRange!),
                staleTime: METRICS_STALE_TIME,
                gcTime: METRICS_CACHE_TIME,
                enabled: !!dateRange,
            },
            {
                queryKey: ["metrics", "quality", dateRange],
                queryFn: () => readQualityMetrics(dateRange!),
                staleTime: METRICS_STALE_TIME,
                gcTime: METRICS_CACHE_TIME,
                enabled: !!dateRange,
            },
        ],
    });
}
