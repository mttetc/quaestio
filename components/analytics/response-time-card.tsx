"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/shared/utils";

interface ResponseTimeData {
  averageHours: number;
  trend?: {
    percentage: number;
    direction: "up" | "down";
  };
}

interface ResponseTimeCardProps {
  dateRange: DateRange;
  className?: string;
}

export function ResponseTimeCard({ dateRange, className }: ResponseTimeCardProps) {
  const { data, isLoading, error } = useQuery<ResponseTimeData>({
    queryKey: ["responseTime", dateRange],
    queryFn: async () => {
      if (!dateRange.from || !dateRange.to) {
        throw new Error("Date range is required");
      }

      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });

      const response = await fetch(`/api/analytics/response-time?${params}`);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to fetch response time data");
      }

      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Average Response Time
        </CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-muted-foreground">
            Failed to load data
          </div>
        ) : !data ? (
          <div className="text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data.averageHours.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                hours
              </span>
            </div>
            {data.trend && (
              <div className={cn(
                "flex items-center text-sm",
                data.trend.direction === "down" ? "text-green-500" : "text-red-500"
              )}>
                {data.trend.direction === "down" ? (
                  <TrendingDown className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingUp className="mr-1 h-4 w-4" />
                )}
                {data.trend.percentage.toFixed(1)}% from previous period
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}