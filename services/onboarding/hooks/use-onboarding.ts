import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  steps: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
}

export function useOnboardingState() {
  return useQuery<OnboardingState>({
    queryKey: ["onboarding"],
    queryFn: async () => {
      const response = await fetch("/api/onboarding/state");
      return response.json();
    },
  });
}

export function useUpdateOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (step: number) => {
      const response = await fetch("/api/onboarding/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ step }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
    },
  });
} 