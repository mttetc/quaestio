"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BarChart2, ThumbsUp, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/shared/utils";
import { 
  useResponseMetrics, 
  useVolumeMetrics, 
  useQualityMetrics,
  getTopCategories,
} from "@/services/analytics/hooks/use-metrics";

interface MetricCardProps {
  title: string;
  icon: React.ElementType;
  isLoading?: boolean;
  children: React.ReactNode;
}

interface MetricsOverviewProps {
  dateRange: DateRange;
  className?: string;
}

function MetricCard({ title, icon: Icon, isLoading, children }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsOverview({ dateRange, className }: MetricsOverviewProps) {
  const { data: responseMetrics, isLoading: isLoadingResponse } = useResponseMetrics(dateRange);
  const { data: volumeMetrics, isLoading: isLoadingVolume } = useVolumeMetrics(dateRange);
  const { data: qualityMetrics, isLoading: isLoadingQuality } = useQualityMetrics(dateRange);

  const topCategories = volumeMetrics?.byCategory 
    ? getTopCategories(volumeMetrics.byCategory)
    : [];

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      <MetricCard title="Response Time" icon={Clock} isLoading={isLoadingResponse}>
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
      </MetricCard>

      <MetricCard title="Volume" icon={BarChart2} isLoading={isLoadingVolume}>
        <div className="text-2xl font-bold">
          {volumeMetrics?.totalQuestions || 0}
        </div>
        <div className="mt-4 space-y-2">
          {topCategories.map(([category, count]) => (
            <div key={category} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{category}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </MetricCard>

      <MetricCard title="Quality Score" icon={ThumbsUp} isLoading={isLoadingQuality}>
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
      </MetricCard>
    </div>
  );
}