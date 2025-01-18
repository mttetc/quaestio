"use client";

import { Suspense, useState } from "react";
import { ViewProps } from "@/lib/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadAllMetrics } from "@/lib/features/analytics/hooks/use-metrics";
import { useReadSentimentHeatmap } from "@/lib/features/analytics/hooks/use-sentiment";
import { ResponseTimeCard } from "@/lib/features/analytics/components/metrics/cards/response-time-card";
import { VolumeMetricsCard } from "@/lib/features/analytics/components/metrics/cards/volume-metrics-card";
import { QualityMetricsCard } from "@/lib/features/analytics/components/metrics/cards/quality-metrics-card";
import { SentimentChart } from "@/lib/features/analytics/components/sentiment/sentiment-chart";
import { QuestionChart } from "@/lib/features/analytics/components/questions/chart";
import { QuestionList } from "@/lib/features/analytics/components/questions/list";
import { DateRange } from "react-day-picker";

// Default date range for 30 days
const defaultDateRange = {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
};

export function InsightsView({ className }: ViewProps) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange);

    // Use parallel queries for metrics
    const [
        { data: responseMetrics, isLoading: isLoadingResponse },
        { data: volumeMetrics, isLoading: isLoadingVolume },
        { data: qualityMetrics, isLoading: isLoadingQuality },
    ] = useReadAllMetrics(dateRange);

    // Sentiment data is fetched separately as it's in a different module
    const { data: sentimentHeatmap, isLoading: isLoadingSentiment } = useReadSentimentHeatmap(dateRange);

    // Let Next.js loading.tsx handle initial loading
    if (isLoadingResponse || isLoadingVolume || isLoadingQuality || isLoadingSentiment) {
        return null;
    }

    return (
        <div className={`space-y-6 ${className ?? ""}`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Insights & Analytics</h2>
                    <p className="text-muted-foreground">Track your Q&A performance and engagement</p>
                </div>
                <DatePickerWithRange
                    date={dateRange}
                    onDateChange={(newDateRange) => newDateRange && setDateRange(newDateRange)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Suspense fallback={<div>Loading response metrics...</div>}>
                    <ResponseTimeCard metrics={responseMetrics} dateRange={dateRange} />
                </Suspense>
                <Suspense fallback={<div>Loading volume metrics...</div>}>
                    <VolumeMetricsCard metrics={volumeMetrics} />
                </Suspense>
                <Suspense fallback={<div>Loading quality metrics...</div>}>
                    <QualityMetricsCard metrics={qualityMetrics} />
                </Suspense>
            </div>

            <Tabs defaultValue="sentiment">
                <TabsList>
                    <TabsTrigger value="sentiment">Sentiment Trends</TabsTrigger>
                    <TabsTrigger value="questions">Question Trends</TabsTrigger>
                    <TabsTrigger value="top-questions">Top Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="sentiment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sentiment Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<div>Loading sentiment chart...</div>}>
                                <SentimentChart data={sentimentHeatmap} />
                            </Suspense>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="questions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Question Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<div>Loading question trends...</div>}>
                                <QuestionChart dateRange={dateRange} />
                            </Suspense>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="top-questions" className="space-y-6">
                    <Suspense fallback={<div>Loading top questions...</div>}>
                        <QuestionList dateRange={dateRange} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}
