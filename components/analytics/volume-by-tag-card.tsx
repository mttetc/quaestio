"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVolumeByTagMetrics } from "@/services/analytics/hooks/use-metrics";

export function VolumeByTagCard() {
  const { data, isLoading, error } = useVolumeByTagMetrics();

  if (isLoading) {
    return <div>Loading volume data...</div>;
  }

  if (error || !data?.volumes) {
    return <div>Failed to load volume data</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume by Tag</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.volumes.map((volume) => (
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