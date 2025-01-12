import type { DateRange } from "react-day-picker";
import { z } from "zod";
import {
    questionAnalyticsSchema,
    questionChartDataSchema,
    type QuestionAnalytics,
    type QuestionChartData,
} from "@/lib/features/analytics/schemas/questions";

export async function readQuestions(dateRange: DateRange): Promise<QuestionAnalytics[]> {
    const params = new URLSearchParams();
    if (dateRange.from) params.set("from", dateRange.from.toISOString());
    if (dateRange.to) params.set("to", dateRange.to.toISOString());

    const response = await fetch(`/api/analytics/questions?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    const parsed = z.array(questionAnalyticsSchema).safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid question analytics: ${parsed.error.message}`);
    }

    return parsed.data;
}

export async function readQuestionChart(dateRange: DateRange): Promise<{ data: QuestionChartData[] }> {
    const params = new URLSearchParams();
    if (dateRange.from) params.set("from", dateRange.from.toISOString());
    if (dateRange.to) params.set("to", dateRange.to.toISOString());

    const response = await fetch(`/api/analytics/question-chart?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch question chart data");
    }

    const data = await response.json();
    const parsed = z
        .object({
            data: z.array(questionChartDataSchema),
        })
        .safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid question chart data: ${parsed.error.message}`);
    }

    return parsed.data;
}
