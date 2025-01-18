"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";
import { useReadQuestionChart } from "@/lib/features/analytics/hooks/use-questions";
import { DateRange } from "react-day-picker";

interface QuestionChartProps {
    dateRange: DateRange | undefined;
}

export function QuestionChart({ dateRange }: QuestionChartProps) {
    const { data: chart } = useReadQuestionChart(dateRange);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Question Volume</CardTitle>
            </CardHeader>
            <CardContent>
                <LineChart data={chart?.data ?? []} xField="date" yField="count" tooltipTitle="Questions" />
            </CardContent>
        </Card>
    );
}
