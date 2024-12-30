"use client";

import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { generateHeatmapCellKey } from '@/lib/utils/key-generation';
import { cn } from "@/lib/utils";

interface SentimentData {
  date: string;
  sentiment: "positive" | "negative" | "neutral";
  count: number;
}

interface SentimentHeatmapProps {
  dateRange: DateRange;
}

function getHeatmapColor(sentiment: SentimentData | undefined): string {
  if (!sentiment) return "bg-gray-100";
  
  switch (sentiment.sentiment) {
    case "positive":
      return "bg-green-500";
    case "negative":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export function SentimentHeatmap({ dateRange }: SentimentHeatmapProps) {
  const { data: sentiments, isLoading } = useQuery({
    queryKey: ['sentiment-heatmap', dateRange],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/sentiment?${new URLSearchParams({
          startDate: dateRange.from?.toISOString() ?? '',
          endDate: dateRange.to?.toISOString() ?? ''
        })}`
      );
      if (!response.ok) throw new Error('Failed to fetch sentiment data');
      return response.json();
    },
  });

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
            className={cn(
              "aspect-square rounded-sm",
              getHeatmapColor(sentiment)
            )}
            title={sentiment ? `${sentiment.date}: ${sentiment.count} ${sentiment.sentiment}` : 'No data'}
          />
        );
      })}
    </div>
  );
}