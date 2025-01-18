"use client";

import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useReadResponseMetrics } from "@/lib/features/analytics/hooks/use-metrics";
import { MetricCard } from "./metric-card";

interface ResponseTimeCardProps {
    metrics?: any;
    dateRange?: DateRange;
    className?: string;
    summary?: boolean;
}

export function ResponseTimeCard({ metrics: propMetrics, dateRange, className, summary = false }: ResponseTimeCardProps) {
    const { data: fetchedMetrics } = useReadResponseMetrics(dateRange);
    const metrics = propMetrics || fetchedMetrics;

    if (!metrics) return null;

    if (summary) {
        return (
            <MetricCard title="Response Time" icon={Clock} className={className} summary>
                <div className="text-2xl font-bold">{metrics.averageTimeHours.toFixed(1)}h</div>
                <Progress
                    value={Math.min(100, (metrics.averageTimeHours / 24) * 100)}
                    className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">{metrics.totalResponses} total responses</p>
            </MetricCard>
        );
    }

    return (
        <MetricCard title="Response Time" icon={Clock} className={className}>
            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-bold">{metrics.averageTimeHours.toFixed(1)}h</div>
                    <Progress
                        value={Math.min(100, (metrics.averageTimeHours / 24) * 100)}
                        className="mt-2"
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                        Average response time over the selected period
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Responses</span>
                        <span>{metrics.totalResponses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fastest Response</span>
                        <span>{metrics.fastestResponseHours.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Slowest Response</span>
                        <span>{metrics.slowestResponseHours.toFixed(1)}h</span>
                    </div>
                </div>
            </div>
        </MetricCard>
    );
}
