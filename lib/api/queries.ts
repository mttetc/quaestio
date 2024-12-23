import { useQuery } from "@tanstack/react-query";

// Email Accounts
export function useEmailAccounts() {
  return useQuery({
    queryKey: ["emailAccounts"],
    queryFn: async () => {
      const response = await fetch("/api/email/accounts");
      if (!response.ok) throw new Error("Failed to fetch email accounts");
      return response.json();
    },
  });
}

// Analytics
export function useAnalytics(dateRange: { from: Date; to: Date }) {
  return useQuery({
    queryKey: ["analytics", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });
      const response = await fetch(`/api/analytics/questions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });
}

// Response Time
export function useResponseTime(dateRange: { from: Date; to: Date }) {
  return useQuery({
    queryKey: ["responseTime", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });
      const response = await fetch(`/api/analytics/response-time?${params}`);
      if (!response.ok) throw new Error("Failed to fetch response time");
      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });
}

// Volume by Tag
export function useVolumeByTag(dateRange: { from: Date; to: Date }) {
  return useQuery({
    queryKey: ["volumeByTag", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });
      const response = await fetch(`/api/analytics/volume-by-tag?${params}`);
      if (!response.ok) throw new Error("Failed to fetch volume data");
      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });
}

// Solutions
export function useSolutions(qaId: string) {
  return useQuery({
    queryKey: ["solutions", qaId],
    queryFn: async () => {
      const response = await fetch(`/api/qa/${qaId}/solutions`);
      if (!response.ok) throw new Error("Failed to fetch solutions");
      return response.json();
    },
  });
}

// Token Balance
export function useTokenBalance() {
  return useQuery({
    queryKey: ["tokenBalance"],
    queryFn: async () => {
      const response = await fetch("/api/tokens/balance");
      if (!response.ok) throw new Error("Failed to fetch token balance");
      const data = await response.json();
      return data.balance;
    },
  });
}