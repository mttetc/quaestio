"use client";

import { Suspense } from "react";
import { ViewProps } from "@/lib/types/components";
import { Card, CardContent } from "@/components/ui/card";
import { useDateRange } from "@/lib/features/analytics/hooks/use-date-range";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsOverview } from "@/lib/features/analytics/components/metrics/metrics-overview";
import { QuestionChart } from "@/lib/features/analytics/components/questions/chart";
import { SentimentChart } from "@/lib/features/analytics/components/sentiment/sentiment-chart";

function CardSkeleton() {
    return (
        <Card>
            <CardContent className="h-[450px] animate-pulse" />
        </Card>
    );
}

export function InsightsView({ className }: ViewProps) {
    const { dateRange, setDateRange } = useDateRange();

    return (
        <div className={className}>
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Insights & Analytics</h2>
                    <p className="text-muted-foreground">Track your Q&A performance and engagement</p>
                </div>
                <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            </div>

            <Tabs defaultValue="overview" className="space-y-4 mt-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <ErrorBoundary>
                        <MetricsOverview dateRange={dateRange} />
                    </ErrorBoundary>
                </TabsContent>

                <TabsContent value="sentiment" className="space-y-4">
                    <ErrorBoundary>
                        <Suspense fallback={<CardSkeleton />}>
                            <SentimentChart dateRange={dateRange} />
                        </Suspense>
                    </ErrorBoundary>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                    <ErrorBoundary>
                        <Suspense fallback={<CardSkeleton />}>
                            <QuestionChart dateRange={dateRange} />
                        </Suspense>
                    </ErrorBoundary>
                </TabsContent>
            </Tabs>
        </div>
    );
}
