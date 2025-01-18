"use client"

import { ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { QualityMetrics } from "../../../schemas/metrics";
import { MetricCard } from "./metric-card";

interface QualityMetricsCardProps {
    metrics?: QualityMetrics;
    className?: string;
    summary?: boolean;
}

export function QualityMetricsCard({ metrics, className, summary = false }: QualityMetricsCardProps) {
    if (summary) {
        return (
            <MetricCard title="Quality" icon={ThumbsUp} className={className} summary>
                <div className="text-2xl font-bold">{(metrics?.helpfulnessScore || 0).toFixed(1)}%</div>
                <Progress
                    value={metrics?.helpfulnessScore || 0}
                    className="mt-2"
                />
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <span>{(metrics?.averageConfidence || 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sentiment</span>
                        <span>{((metrics?.sentimentScore || 0) * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </MetricCard>
        );
    }

    return (
        <MetricCard title="Quality" icon={ThumbsUp} className={className}>
            <div className="grid gap-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Helpfulness Score</p>
                    <p className="text-2xl font-bold">{(metrics?.helpfulnessScore || 0).toFixed(1)}%</p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Average Confidence</p>
                    <p className="text-2xl font-bold">{(metrics?.averageConfidence || 0).toFixed(1)}%</p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Sentiment Score</p>
                    <p className="text-2xl font-bold">{((metrics?.sentimentScore || 0) * 100).toFixed(1)}%</p>
                </div>
            </div>
        </MetricCard>
    );
}
