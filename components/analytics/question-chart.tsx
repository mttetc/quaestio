"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

interface QuestionChartProps {
  dateRange: DateRange;
}

export function QuestionChart({ dateRange }: QuestionChartProps) {
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.from?.toISOString() || "",
        endDate: dateRange.to?.toISOString() || "",
      });
      const response = await fetch(`/api/analytics/questions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch question data");
      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });

  const chartData = useMemo(() => {
    if (!questions?.results) return [];
    return questions.results.map((q: any) => ({
      date: new Date(q.date).toLocaleDateString(),
      count: q.count,
      category: q.category,
    }));
  }, [questions]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}