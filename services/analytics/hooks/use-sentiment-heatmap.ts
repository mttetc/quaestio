import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { api } from "@/lib/shared/api";

export interface SentimentData {
  date: string;
  sentiment: "positive" | "negative" | "neutral";
  count: number;
}

export interface SentimentHeatmapData {
  sentiment: SentimentData[];
}

export function useSentimentHeatmap(dateRange: DateRange) {
  return useQuery({
    queryKey: ['sentiment-heatmap', dateRange],
    queryFn: async () => {
      return api.get<SentimentHeatmapData>('/api/analytics/sentiment', {
        params: {
          startDate: dateRange.from?.toISOString() ?? '',
          endDate: dateRange.to?.toISOString() ?? ''
        }
      });
    },
  });
} 