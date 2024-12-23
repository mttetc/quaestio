export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Core analytics types
export interface AnalyticsMetric {
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface TimeSeriesData {
  date: Date;
  value: number;
  category?: string;
}

// Engagement metrics
export interface ResponseMetrics extends AnalyticsMetric {
  averageTimeHours: number;
  totalResponses: number;
}

export interface VolumeMetrics extends AnalyticsMetric {
  totalQuestions: number;
  byCategory: Record<string, number>;
}

// Content metrics
export interface ContentMetrics extends AnalyticsMetric {
  coverage: number; // 0-1 score
  gaps: ContentGap[];
}

export interface ContentGap {
  topic: string;
  frequency: number;
  importance: number;
  suggestedContent: string;
}

// Quality metrics
export interface QualityMetrics extends AnalyticsMetric {
  averageConfidence: number;
  sentimentScore: number;
  helpfulnessScore: number;
}