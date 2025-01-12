"use client";

import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "react-day-picker";
import {
    readResponseTimeMetrics,
    readVolumeMetrics,
    readQualityMetrics,
} from "@/lib/features/analytics/queries/readMetrics";
import type { ResponseMetrics, VolumeMetrics, QualityMetrics } from "@/lib/features/analytics/schemas/metrics";

export function useReadResponseMetrics(dateRange: DateRange) {
    return useQuery<ResponseMetrics>({
        queryKey: ["metrics", "response", dateRange],
        queryFn: () => readResponseTimeMetrics(dateRange),
    });
}

export function useReadVolumeMetrics(dateRange: DateRange) {
    return useQuery<VolumeMetrics>({
        queryKey: ["metrics", "volume", dateRange],
        queryFn: () => readVolumeMetrics(dateRange),
    });
}

export function useReadQualityMetrics(dateRange: DateRange) {
    return useQuery<QualityMetrics>({
        queryKey: ["metrics", "quality", dateRange],
        queryFn: () => readQualityMetrics(dateRange),
    });
}
