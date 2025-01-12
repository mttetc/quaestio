"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useReadResponseMetrics } from "@/lib/features/analytics/hooks/use-metrics";

interface ResponseTimeCardProps {
    dateRange: DateRange;
    className?: string;
}

export function ResponseTimeCard({ dateRange, className }: ResponseTimeCardProps) {
    const { data: metrics, isLoading } = useReadResponseMetrics(dateRange);

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{metrics?.averageTimeHours.toFixed(1)}h</div>
                        <Progress
                            value={Math.min(100, ((metrics?.averageTimeHours || 0) / 24) * 100)}
                            className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">{metrics?.totalResponses} total responses</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
