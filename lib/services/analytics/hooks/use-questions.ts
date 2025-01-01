import { useQuery } from "@tanstack/react-query";
import { QA } from "@/lib/shared/schemas/qa";

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

export function useQuestionList() {
  return useQuery<QuestionAnalytics[]>({
    queryKey: ["analytics", "questions"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/questions");
      return response.json();
    },
  });
}

export function useQuestionChart(timeframe: string = "7d") {
  return useQuery<{ data: QuestionChartData[] }>({
    queryKey: ["analytics", "question-chart", timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/question-chart?timeframe=${timeframe}`);
      return response.json();
    },
  });
} 