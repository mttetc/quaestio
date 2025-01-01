"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSentimentHeatmap } from "@/services/analytics/hooks/use-sentiment";

interface SentimentHeatmapProps {
  timeframe?: string;
}

export function SentimentHeatmap({ timeframe = "7d" }: SentimentHeatmapProps) {
  const { data: sentiments, isLoading } = useSentimentHeatmap(timeframe);

  if (isLoading) {
    return <div>Loading sentiment data...</div>;
  }

  if (!sentiments?.length) {
    return null;
  }

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
                backgroundColor: `hsl(${day.sentiment * 120}, 70%, 50%)`,
                opacity: Math.max(0.2, day.volume / Math.max(...sentiments.map(d => d.volume))),
              }}
              title={`${new Date(day.date).toLocaleDateString()}: ${Math.round(day.sentiment * 100)}% positive`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 