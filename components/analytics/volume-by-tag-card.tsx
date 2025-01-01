"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVolumeMetrics, type VolumeMetrics } from "@/services/analytics/hooks/use-metrics";
import type { DateRange } from "@/services/analytics/metrics";

interface VolumeData {
  tag: string;
  count: number;
  percentage: number;
}

interface VolumeByTagCardProps {
  dateRange: DateRange;
}

function selectVolumeData(data: VolumeMetrics): VolumeData[] {
  const total = Object.values(data.byCategory).reduce((sum, count) => sum + count, 0);
  return Object.entries(data.byCategory).map(([tag, count]) => ({
    tag,
    count,
    percentage: (count / total) * 100
  }));
}

export function VolumeByTagCard({ dateRange }: VolumeByTagCardProps) {
  const { data, isLoading, error } = useVolumeMetrics(dateRange);
  const volumes = data ? selectVolumeData(data) : null;

  if (isLoading) {
    return <div>Loading volume data...</div>;
  }

  if (error || !volumes) {
    return <div>Failed to load volume data</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume by Tag</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {volumes.map((volume) => (
            <div key={volume.tag} className="flex items-center justify-between">
              <span className="text-sm font-medium">{volume.tag}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {volume.count} questions
                </span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(volume.percentage)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}