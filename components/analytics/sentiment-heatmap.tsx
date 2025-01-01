"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSentimentHeatmap } from "@/services/analytics/hooks/use-sentiment";
import type { DateRange } from "@/services/analytics/metrics";

interface SentimentHeatmapProps {
  dateRange: DateRange;
}

export function SentimentHeatmap({ dateRange }: SentimentHeatmapProps) {
  const { data, isLoading } = useSentimentHeatmap(dateRange);
  const sentiments = data?.sentiment;

  if (isLoading) {
    return <div>Loading sentiment data...</div>;
  }

  if (!sentiments?.length) {
    return null;
  }

  const maxVolume = Math.max(...sentiments.map(d => d.volume));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {sentiments.map((day) => (
            <div
              key={day.date}
              className="aspect-square rounded"
              style={{
                backgroundColor: getSentimentColor(day.sentiment),
                opacity: Math.max(0.2, day.volume / maxVolume),
              }}
              title={`${new Date(day.date).toLocaleDateString()}: ${getSentimentLabel(day.sentiment)}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getSentimentColor(sentiment: "positive" | "negative" | "neutral"): string {
  switch (sentiment) {
    case "positive": return "hsl(120, 70%, 50%)";
    case "negative": return "hsl(0, 70%, 50%)";
    case "neutral": return "hsl(60, 70%, 50%)";
  }
}

function getSentimentLabel(sentiment: "positive" | "negative" | "neutral"): string {
  return `${sentiment.charAt(0).toUpperCase()}${sentiment.slice(1)} sentiment`;
} 