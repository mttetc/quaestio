export interface ResponseTimeData {
  trends: Array<{
    date: string;
    responseTime: number;
  }>;
}

export interface VolumeData {
  tag: string;
  count: number;
  percentage: number;
} 