"use client"

import { Progress } from "@/components/ui/progress";
import { BarChart2 } from "lucide-react";
import type { VolumeMetrics } from "../../../schemas/metrics";
import { MetricCard } from "./metric-card";

interface VolumeMetricsCardProps {
    metrics?: VolumeMetrics;
    className?: string;
    summary?: boolean;
}

function getTopCategories(byCategory: Record<string, number>): Array<[string, number]> {
    return Object.entries(byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
}

function calculateProgress(totalQuestions: number | undefined): number {
    return Math.min(100, ((totalQuestions || 0) / 100) * 100);
}

export function VolumeMetricsCard({ metrics, className, summary = false }: VolumeMetricsCardProps) {
    const totalByCategory = metrics?.byCategory
        ? Object.values(metrics.byCategory).reduce((a, b) => a + b, 0)
        : 0;

    const topCategories = metrics?.byCategory ? getTopCategories(metrics.byCategory) : [];
    const categoriesCount = metrics?.byCategory ? Object.keys(metrics.byCategory).length : 0;

    if (summary) {
        return (
            <MetricCard title="Volume" icon={BarChart2} className={className} summary>
                <div className="text-2xl font-bold">{metrics?.totalQuestions || 0}</div>
                <Progress
                    value={calculateProgress(metrics?.totalQuestions)}
                    className="mt-2"
                />
                <div className="mt-4 space-y-2">
                    {topCategories.slice(0, 3).map(([category, count]) => (
                        <div key={category} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{category}</span>
                            <span>{count}</span>
                        </div>
                    ))}
                </div>
            </MetricCard>
        );
    }

    return (
        <MetricCard title="Volume" icon={BarChart2} className={className}>
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                        <p className="text-2xl font-bold">{metrics?.totalQuestions || 0}</p>
                        <Progress
                            value={calculateProgress(metrics?.totalQuestions)}
                            className="mt-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Categories</p>
                        <p className="text-2xl font-bold">{categoriesCount}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Average per Category</p>
                        <p className="text-2xl font-bold">
                            {categoriesCount > 0
                                ? (totalByCategory / categoriesCount).toFixed(1)
                                : "0"}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Top Categories</p>
                    <div className="space-y-2">
                        {topCategories.map(([category, count]) => (
                            <div key={category} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{category}</span>
                                <span>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MetricCard>
    );
}
