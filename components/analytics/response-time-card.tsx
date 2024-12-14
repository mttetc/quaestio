"use client";

import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ResponseTimeCardProps {
  dateRange: DateRange;
}

export function ResponseTimeCard({ dateRange }: ResponseTimeCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["responseTime", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.from?.toISOString() || "",
        endDate: dateRange.to?.toISOString() || "",
      });
      const response = await fetch(`/api/analytics/response-time?${params}`);
      if (!response.ok) throw new Error("Failed to fetch response time data");
      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Average Response Time
        </CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              {data?.averageHours.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                hours
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}