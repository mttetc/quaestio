"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResponseMetrics } from "@/services/analytics/hooks/use-metrics";
import type { DateRange as ApiDateRange } from "@/services/analytics/metrics";
import type { DateRange } from "react-day-picker";

interface ResponseTimeCardProps {
  dateRange: DateRange;
}

export function ResponseTimeCard({ dateRange }: ResponseTimeCardProps) {
  const { data, isLoading, error } = useResponseMetrics(dateRange);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading response time data</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {data?.averageTimeHours.toFixed(1)}h
          </div>
          <p className="text-sm text-muted-foreground">
            {data?.totalResponses} total responses
          </p>
        </div>
      </CardContent>
    </Card>
  );
}