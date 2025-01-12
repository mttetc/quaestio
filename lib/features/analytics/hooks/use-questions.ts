"use client";

import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "react-day-picker";
import { readQuestions, readQuestionChart } from "@/lib/features/analytics/queries/readQuestions";
import type { QuestionAnalytics, QuestionChartData } from "@/lib/features/analytics/schemas/questions";

export function useReadQuestionList(dateRange: DateRange) {
    return useQuery<QuestionAnalytics[]>({
        queryKey: ["questions", "list", dateRange],
        queryFn: () => readQuestions(dateRange),
    });
}

export function useReadQuestionChart(dateRange: DateRange) {
    return useQuery<{ data: QuestionChartData[] }>({
        queryKey: ["questions", "chart", dateRange],
        queryFn: () => readQuestionChart(dateRange),
    });
}
