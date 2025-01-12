"use client";

import type { DateRange } from "react-day-picker";
import { useReadSentimentHeatmap } from "@/lib/features/analytics/hooks/use-sentiment";
import { generateHeatmapCellKey } from "@/lib/utils/key-generation";
import { cn } from "@/lib/utils";
import { SentimentHeatmapData } from "@/lib/features/analytics/schemas/sentiment";

interface SentimentHeatmapProps {
    dateRange: DateRange;
}

function getHeatmapColor(data: SentimentHeatmapData["sentiment"][0] | undefined): string {
    if (!data) return "bg-gray-100";

    switch (data.sentiment) {
        case "positive":
            return "bg-green-500";
        case "negative":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
}

export function SentimentHeatmap({ dateRange }: SentimentHeatmapProps) {
    const { data: sentiments, isLoading } = useReadSentimentHeatmap(dateRange);

    if (isLoading) {
        return <div>Loading sentiment data...</div>;
    }

    return (
        <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 * 24 }).map((_, i) => {
                const row = Math.floor(i / 7);
                const col = i % 7;
                const sentiment = sentiments?.sentiment[i];

                return (
                    <div
                        key={generateHeatmapCellKey(row, col)}
                        className={cn("aspect-square rounded-sm", getHeatmapColor(sentiment))}
                        title={sentiment ? `${sentiment.date}: ${sentiment.count} ${sentiment.sentiment}` : "No data"}
                    />
                );
            })}
        </div>
    );
}
