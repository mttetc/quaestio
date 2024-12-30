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
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionData {
  id: string;
  date: string;
  count: number;
  category: string;
}

interface QuestionResponse {
  results: QuestionData[];
}

interface QuestionChartProps {
  dateRange: DateRange;
  className?: string;
}

function formatChartData(data: QuestionData[]): QuestionData[] {
  return data.map((q) => ({
    ...q,
    date: new Date(q.date).toLocaleDateString(),
  }));
}

export function QuestionChart({ dateRange, className }: QuestionChartProps) {
  const { data, isLoading, error } = useQuery<QuestionResponse>({
    queryKey: ["questions", dateRange],
    queryFn: async () => {
      if (!dateRange.from || !dateRange.to) {
        throw new Error("Date range is required");
      }

      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });

      const response = await fetch(`/api/analytics/questions?${params}`);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to fetch question data");
      }

      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });

  const chartData = useMemo(() => {
    if (!data?.results) return [];
    return formatChartData(data.results);
  }, [data]);

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Failed to load data
            </div>
          ) : !chartData.length ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))"
                />
                <XAxis 
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  name="Questions"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}