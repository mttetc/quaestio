import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  email: string;
  name?: string;
  onboardingCompleted: boolean;
}

export function useUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      return response.json();
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
} 