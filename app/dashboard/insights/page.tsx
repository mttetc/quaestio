"use client";

import { useState } from "react";
import { SentimentHeatmap } from "@/components/analysis/sentiment-heatmap";
import { QuestionChart } from "@/components/analytics/question-chart";
import { ResponseTimeCard } from "@/components/analytics/response-time-card";
import { VolumeByTagCard } from "@/components/analytics/volume-by-tag-card";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { DateRange } from "react-day-picker";

export default function InsightsPage() {
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Insights Overview</h2>
                <p className="text-muted-foreground">Track and analyze patterns in your Q&A interactions</p>
            </div>

            <div className="flex justify-end">
                <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ResponseTimeCard dateRange={dateRange} />
                <VolumeByTagCard dateRange={dateRange} />
            </div>

            <div className="grid gap-6">
                <QuestionChart dateRange={dateRange} />
                <SentimentHeatmap dateRange={dateRange} />
            </div>
        </div>
    );
}
