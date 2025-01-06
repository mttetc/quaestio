"use client";

import { useState } from "react";
import { SentimentHeatmap } from "@/components/analysis/sentiment-heatmap";
import { QuestionChart } from "@/components/analytics/question-chart";
import { ResponseTimeCard } from "@/components/analytics/response-time-card";
import { VolumeByTagCard } from "@/components/analytics/volume-by-tag-card";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { PageHeader } from "@/components/ui/page-header";
import { PAGE_HEADERS } from "@/lib/constants/text";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function InsightsPage() {
    const defaultDateRange = {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
    };
    const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range ?? defaultDateRange);
    };

    return (
        <div className="space-y-6">
            <PageHeader title={PAGE_HEADERS.INSIGHTS.title} description={PAGE_HEADERS.INSIGHTS.description} />

            <div className="flex justify-end">
                <DatePickerWithRange date={dateRange} onDateChange={handleDateRangeChange} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ErrorBoundary>
                    <ResponseTimeCard dateRange={dateRange} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <VolumeByTagCard dateRange={dateRange} />
                </ErrorBoundary>
            </div>

            <div className="grid gap-6">
                <ErrorBoundary>
                    <QuestionChart dateRange={dateRange} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <SentimentHeatmap dateRange={dateRange} />
                </ErrorBoundary>
            </div>
        </div>
    );
}
