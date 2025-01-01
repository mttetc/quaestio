"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";
import { useQuestionChart } from "@/services/analytics/hooks/use-questions";
import { DateRange } from "react-day-picker";

interface QuestionChartProps {
  dateRange: DateRange;
}

export function QuestionChart({ dateRange }: QuestionChartProps) {
  const { data, isLoading, error } = useQuestionChart(dateRange);

  if (isLoading) {
    return <div>Loading chart data...</div>;
  }

  if (error || !data) {
    return <div>Failed to load chart data</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          data={data.data}
          xField="date"
          yField="count"
          tooltipTitle="Questions"
        />
      </CardContent>
    </Card>
  );
}