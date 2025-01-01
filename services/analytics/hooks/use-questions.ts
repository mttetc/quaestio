import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "../metrics";

export interface QuestionAnalytics {
  question: string;
  frequency: number;
  lastAsked: string;
  tags: string[];
  confidence: number;
}

export interface QuestionChartData {
  date: string;
  count: number;
}

export function useQuestionList(dateRange: DateRange) {
  return useQuery<QuestionAnalytics[]>({
    queryKey: ["analytics", "questions", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange.from) params.set('from', dateRange.from.toISOString());
      if (dateRange.to) params.set('to', dateRange.to.toISOString());
      
      const response = await fetch(`/api/analytics/questions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      return response.json();
    }
  });
}

export function useQuestionChart(dateRange: DateRange) {
  return useQuery<{ data: QuestionChartData[] }>({
    queryKey: ["analytics", "question-chart", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange.from) params.set('from', dateRange.from.toISOString());
      if (dateRange.to) params.set('to', dateRange.to.toISOString());
      
      const response = await fetch(`/api/analytics/question-chart?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch question chart data');
      }

      return response.json();
    }
  });
} 