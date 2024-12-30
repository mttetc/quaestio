"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Tag, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/shared/utils";

interface VolumeData {
  name: string;
  value: number;
}

interface VolumeByTagCardProps {
  dateRange: DateRange;
  className?: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--destructive))",
  "hsl(var(--muted))",
];

export function VolumeByTagCard({ dateRange, className }: VolumeByTagCardProps) {
  const { data, isLoading, error } = useQuery<{ volumes: VolumeData[] }>({
    queryKey: ["volumeByTag", dateRange],
    queryFn: async () => {
      if (!dateRange.from || !dateRange.to) {
        throw new Error("Date range is required");
      }

      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });

      const response = await fetch(`/api/analytics/volume-by-tag?${params}`);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to fetch volume data");
      }

      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Volume by Tag</CardTitle>
        <Tag className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Failed to load data
          </div>
        ) : !data?.volumes?.length ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.volumes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.volumes.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}