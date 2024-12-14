"use client";

import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Tag } from "lucide-react";

interface VolumeByTagCardProps {
  dateRange: DateRange;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "#FF8042",
];

export function VolumeByTagCard({ dateRange }: VolumeByTagCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["volumeByTag", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.from?.toISOString() || "",
        endDate: dateRange.to?.toISOString() || "",
      });
      const response = await fetch(`/api/analytics/volume-by-tag?${params}`);
      if (!response.ok) throw new Error("Failed to fetch volume data");
      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Volume by Tag</CardTitle>
        <Tag className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.volumes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data?.volumes.map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
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