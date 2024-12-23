"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

interface SentimentData {
  sentiment: Array<{
    date: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    count: number;
  }>;
}

interface SentimentHeatmapProps {
  dateRange: DateRange;
}

export function SentimentHeatmap({ dateRange }: SentimentHeatmapProps) {
  const { data: sentiments, isLoading } = useQuery({
    queryKey: ['sentiments', dateRange],
    queryFn: async () => {
      const response = await fetch('/api/analytics/sentiment?' + new URLSearchParams({
        startDate: dateRange.from?.toISOString() ?? '',
        endDate: dateRange.to?.toISOString() ?? ''
      }));
      if (!response.ok) throw new Error('Failed to fetch sentiment data');
      return response.json() as Promise<SentimentData>;
    },
    enabled: !!dateRange.from && !!dateRange.to
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {sentiments?.sentiment.map((data, i) => (
              <div
                key={i}
                className={`h-10 rounded ${
                  data.sentiment === 'positive'
                    ? 'bg-green-500'
                    : data.sentiment === 'negative'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }`}
                title={`${data.date}: ${data.count} ${data.sentiment}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}