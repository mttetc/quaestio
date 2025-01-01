import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/shared/api";
import { EmailSubscription, UnsubscribeResult } from "@/services/email/subscription/types";

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      return api.get<EmailSubscription[]>('/api/email/subscriptions');
    },
  });
}

export function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      return api.post<UnsubscribeResult>('/api/email/unsubscribe', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
} 