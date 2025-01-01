import { useQuery } from "@tanstack/react-query";

export interface SentimentData {
  date: string;
  sentiment: number;
  volume: number;
}

export function useSentimentHeatmap(timeframe: string = "7d") {
  return useQuery<SentimentData[]>({
    queryKey: ["analytics", "sentiment", timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/sentiment?timeframe=${timeframe}`);
      return response.json();
    },
  });
} 