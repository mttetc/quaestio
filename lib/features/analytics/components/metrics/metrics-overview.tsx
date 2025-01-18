"use client";

import { DateRange } from "react-day-picker";
import { useReadAllMetrics } from "../../hooks/use-metrics";
import { ResponseTimeCard } from "./cards/response-time-card";
import { VolumeMetricsCard } from "./cards/volume-metrics-card";
import { QualityMetricsCard } from "./cards/quality-metrics-card";

interface MetricsOverviewProps {
    dateRange: DateRange | undefined;
    className?: string;
}

export function MetricsOverview({ dateRange, className }: MetricsOverviewProps) {
    const [
        { data: responseMetrics },
        { data: volumeMetrics },
        { data: qualityMetrics }
    ] = useReadAllMetrics(dateRange);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ResponseTimeCard metrics={responseMetrics} />
            <VolumeMetricsCard metrics={volumeMetrics} />
            <QualityMetricsCard metrics={qualityMetrics} />
        </div>
    );
}
