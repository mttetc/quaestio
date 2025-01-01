import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  plan: {
    id: string;
    name: string;
    price: number;
  };
}

export function useSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const response = await fetch("/api/subscriptions");
      return response.json();
    },
  });
}

export function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
} 