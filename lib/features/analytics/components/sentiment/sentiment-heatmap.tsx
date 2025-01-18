"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useReadSentimentHeatmap } from "../../hooks/use-sentiment";
import { DateRange } from "react-day-picker";

interface SentimentHeatmapProps {
    dateRange: DateRange | undefined;
    className?: string;
}

function getHeatmapColor(sentiment: { sentiment: string; count: number; volume: number } | undefined): string {
    if (!sentiment || sentiment.count === 0) {
        return "bg-muted";
    }

    const intensity = Math.min(1, sentiment.count / sentiment.volume);

    switch (sentiment.sentiment) {
        case "positive":
            return cn("bg-green-500", {
                "opacity-20": intensity < 0.25,
                "opacity-40": intensity >= 0.25 && intensity < 0.5,
                "opacity-60": intensity >= 0.5 && intensity < 0.75,
                "opacity-80": intensity >= 0.75,
            });
        case "negative":
            return cn("bg-red-500", {
                "opacity-20": intensity < 0.25,
                "opacity-40": intensity >= 0.25 && intensity < 0.5,
                "opacity-60": intensity >= 0.5 && intensity < 0.75,
                "opacity-80": intensity >= 0.75,
            });
        default:
            return cn("bg-blue-500", {
                "opacity-20": intensity < 0.25,
                "opacity-40": intensity >= 0.25 && intensity < 0.5,
                "opacity-60": intensity >= 0.5 && intensity < 0.75,
                "opacity-80": intensity >= 0.75,
            });
    }
}

function generateHeatmapCellKey(row: number, col: number): string {
    return `${row}-${col}`;
}

export function SentimentHeatmap({ dateRange, className }: SentimentHeatmapProps) {
    const { data } = useReadSentimentHeatmap(dateRange);
    const sentiments = data?.sentiment;

    if (!sentiments?.length) {
        return null;
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Sentiment Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 * 24 }).map((_, i) => {
                        const row = Math.floor(i / 7);
                        const col = i % 7;
                        const sentiment = sentiments[i];

                        return (
                            <div
                                key={generateHeatmapCellKey(row, col)}
                                className={cn("aspect-square rounded-sm", getHeatmapColor(sentiment))}
                                title={
                                    sentiment
                                        ? `${sentiment.date}: ${sentiment.count} ${sentiment.sentiment}`
                                        : "No data"
                                }
                            />
                        );
                    })}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-sm bg-green-500" />
                        <span className="text-muted-foreground">Positive</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-sm bg-blue-500" />
                        <span className="text-muted-foreground">Neutral</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-sm bg-red-500" />
                        <span className="text-muted-foreground">Negative</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
