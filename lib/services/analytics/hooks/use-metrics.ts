import { ResponseTimeData, VolumeData } from "@/lib/shared/schemas/analytics";
import { useQuery } from "@tanstack/react-query";

export function useResponseTimeMetrics() {
  return useQuery<ResponseTimeData>({
    queryKey: ["analytics", "response-time"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/response-time");
      return response.json();
    },
  });
}

export function useVolumeByTagMetrics() {
  return useQuery<{ volumes: VolumeData[] }>({
    queryKey: ["analytics", "volume-by-tag"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/volume-by-tag");
      return response.json();
    },
  });
}

export function useMetricsOverview<T>(metric: string) {
  return useQuery<T>({
    queryKey: ["analytics", "metrics", metric],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/metrics/${metric}`);
      return response.json();
    },
  });
} 