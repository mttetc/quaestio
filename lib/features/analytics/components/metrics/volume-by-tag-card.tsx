"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useReadVolumeMetrics } from "@/lib/features/analytics/hooks/use-metrics";
import type { VolumeMetrics } from "@/lib/features/analytics/schemas/metrics";

function getTopCategories(byCategory: Record<string, number>): Array<[string, number]> {
    return Object.entries(byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
}

interface VolumeByTagCardProps {
    dateRange: DateRange;
    className?: string;
}

export function VolumeByTagCard({ dateRange, className }: VolumeByTagCardProps) {
    const { data: metrics, isLoading } = useReadVolumeMetrics(dateRange);
    const topCategories = metrics?.byCategory ? getTopCategories(metrics.byCategory) : [];

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Volume by Tag</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{metrics?.totalQuestions || 0}</div>
                        <div className="mt-4 space-y-2">
                            {topCategories.map(([category, count]) => (
                                <div key={category} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{category}</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
