"use client";

import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { readQuestions, readQuestionChart } from "@/lib/features/analytics/queries/readQuestions";
import type { QuestionAnalytics, QuestionChartData } from "@/lib/features/analytics/schemas/questions";
import { DateRange } from "react-day-picker";

// Cache time configurations
const QUESTIONS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUESTIONS_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

const questionKeys = {
    list: (dateRange: DateRange | undefined) => ["questions", "list", dateRange] as const,
    chart: (dateRange: DateRange | undefined) => ["questions", "chart", dateRange] as const,
};

export function useReadQuestionList(dateRange: DateRange | undefined) {
    const queryClient = useQueryClient();

    // Prefetch next day's data only if dateRange exists
    if (dateRange?.to) {
        const nextDay = new Date(dateRange.to);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDateRange = { ...dateRange, to: nextDay };

        queryClient.prefetchQuery({
            queryKey: questionKeys.list(nextDateRange),
            queryFn: () => readQuestions(nextDateRange),
            staleTime: QUESTIONS_STALE_TIME,
            gcTime: QUESTIONS_CACHE_TIME,
        });
    }

    return useSuspenseQuery<QuestionAnalytics[]>({
        queryKey: questionKeys.list(dateRange),
        queryFn: () => readQuestions(dateRange),
        staleTime: QUESTIONS_STALE_TIME,
        gcTime: QUESTIONS_CACHE_TIME
    });
}

export function useReadQuestionChart(dateRange: DateRange | undefined) {
    const queryClient = useQueryClient();

    // Prefetch next day's data only if dateRange exists
    if (dateRange?.to) {
        const nextDay = new Date(dateRange.to);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDateRange = { ...dateRange, to: nextDay };

        queryClient.prefetchQuery({
            queryKey: questionKeys.chart(nextDateRange),
            queryFn: () => readQuestionChart(nextDateRange),
            staleTime: QUESTIONS_STALE_TIME,
            gcTime: QUESTIONS_CACHE_TIME,
        });
    }

    return useQuery<{ data: QuestionChartData[] }>({
        queryKey: questionKeys.chart(dateRange),
        queryFn: () => readQuestionChart(dateRange),
        staleTime: QUESTIONS_STALE_TIME,
        gcTime: QUESTIONS_CACHE_TIME
    });
}
