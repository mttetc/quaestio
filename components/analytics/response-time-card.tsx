"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";
import { useResponseTimeMetrics } from "@/lib/services/analytics/hooks/use-metrics";

export function ResponseTimeCard() {
  const { data, isLoading, error } = useResponseTimeMetrics();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading response time data</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          data={data?.trends || []}
          xField="date"
          yField="responseTime"
          tooltipTitle="Avg. Response Time"
          tooltipUnit="minutes"
        />
      </CardContent>
    </Card>
  );
}