import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { api } from "@/lib/shared/api";

export interface ResponseMetrics {
  averageTimeHours: number;
  totalResponses: number;
}

export interface VolumeMetrics {
  totalQuestions: number;
  byCategory: Record<string, number>;
}

export interface QualityMetrics {
  helpfulnessScore: number;
  averageConfidence: number;
  sentimentScore: number;
}

function useMetricsQuery<T>(endpoint: string, dateRange: DateRange) {
  return useQuery<T>({
    queryKey: [endpoint, dateRange],
    queryFn: async () => {
      if (!dateRange.from || !dateRange.to) {
        throw new Error("Date range is required");
      }

      return api.get<T>(`/api/analytics/metrics/${endpoint}`, {
        params: {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      });
    },
    enabled: !!(dateRange.from && dateRange.to),
  });
}

export function useResponseMetrics(dateRange: DateRange) {
  return useMetricsQuery<ResponseMetrics>("response", dateRange);
}

export function useVolumeMetrics(dateRange: DateRange) {
  return useMetricsQuery<VolumeMetrics>("volume", dateRange);
}

export function useQualityMetrics(dateRange: DateRange) {
  return useMetricsQuery<QualityMetrics>("quality", dateRange);
}

export function getTopCategories(byCategory: Record<string, number>): Array<[string, number]> {
  return Object.entries(byCategory)
    .reduce<Array<[string, number]>>((acc, entry) => [...acc, entry], [])
    .sort(([, a], [, b]) => b - a)
    .filter((_, index) => index < 3);
} 