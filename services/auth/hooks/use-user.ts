import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/shared/schemas/user";
import { api } from "@/lib/shared/api";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return api.get<User>("/api/user");
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.post<User>("/api/user/onboarding/complete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
} 