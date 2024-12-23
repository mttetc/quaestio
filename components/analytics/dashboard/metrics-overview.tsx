"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BarChart2, LineChart, ThumbsUp } from "lucide-react";
import { DateRange } from "@/lib/analytics/types";

interface MetricsOverviewProps {
  dateRange: DateRange;
}

export function MetricsOverview({ dateRange }: MetricsOverviewProps) {
  const { data: responseMetrics } = useQuery({
    queryKey: ['responseMetrics', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });
      const response = await fetch(`/api/analytics/metrics/response?${params}`);
      if (!response.ok) throw new Error('Failed to fetch response metrics');
      return response.json();
    },
  });

  const { data: volumeMetrics } = useQuery({
    queryKey: ['volumeMetrics', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });
      const response = await fetch(`/api/analytics/metrics/volume?${params}`);
      if (!response.ok) throw new Error('Failed to fetch volume metrics');
      return response.json();
    },
  });

  const { data: qualityMetrics } = useQuery({
    queryKey: ['qualityMetrics', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });
      const response = await fetch(`/api/analytics/metrics/quality?${params}`);
      if (!response.ok) throw new Error('Failed to fetch quality metrics');
      return response.json();
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {responseMetrics?.averageTimeHours.toFixed(1)}h
          </div>
          <Progress 
            value={Math.min(100, (responseMetrics?.averageTimeHours || 0) / 24 * 100)} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {responseMetrics?.totalResponses} total responses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Volume</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {volumeMetrics?.totalQuestions || 0}
          </div>
          <div className="mt-4 space-y-2">
            {volumeMetrics?.byCategory && Object.entries(volumeMetrics.byCategory)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 3)
              .map(([category, count]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{category}</span>
                  <span>{count}</span>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((qualityMetrics?.helpfulnessScore || 0) * 100)}%
          </div>
          <Progress 
            value={Math.round((qualityMetrics?.helpfulnessScore || 0) * 100)} 
            className="mt-2"
          />
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confidence</span>
              <span>{Math.round((qualityMetrics?.averageConfidence || 0) * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sentiment</span>
              <span>{Math.round((qualityMetrics?.sentimentScore || 0) * 100)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}