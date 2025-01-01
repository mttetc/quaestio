"use client";

import type { DateRange } from "react-day-picker";
import type { DateRange as ApiDateRange } from "@/services/analytics/metrics";
import { generateHeatmapCellKey } from '@/lib/shared/utils/key-generation';
import { cn } from "@/lib/shared/utils";
import { useSentimentHeatmap, type SentimentData } from "@/services/analytics/hooks/use-sentiment";

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
  const { data: sentiments, isLoading } = useSentimentHeatmap(dateRange);

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