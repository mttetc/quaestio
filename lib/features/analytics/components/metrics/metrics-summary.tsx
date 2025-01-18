"use client";

import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useReadAllMetrics } from "../../hooks/use-metrics";
import { QualityMetricsCard } from "./cards/quality-metrics-card";
import { ResponseTimeCard } from "./cards/response-time-card";
import { VolumeMetricsCard } from "./cards/volume-metrics-card";

interface MetricsSummaryProps {
    dateRange?: DateRange;
    className?: string;
}

export function MetricsSummary({ dateRange, className }: MetricsSummaryProps) {
    const [{ data: responseMetrics }, { data: volumeMetrics }, { data: qualityMetrics }] = useReadAllMetrics(dateRange);

    return (
        <div className={cn("grid gap-4 md:grid-cols-3", className)}>
            <ResponseTimeCard metrics={responseMetrics} summary />
            <VolumeMetricsCard metrics={volumeMetrics} summary />
            <QualityMetricsCard metrics={qualityMetrics} summary />
        </div>
    );
}
