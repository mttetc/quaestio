'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/shared/schemas/user";

export function useUser() {
    return useQuery<User>({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await fetch("/api/user");
            
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            return response.json();
        }
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<User>) => {
            const response = await fetch("/api/user", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        }
    });
}

export function useCompleteOnboarding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch("/api/user/onboarding/complete", {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error('Failed to complete onboarding');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        }
    });
} 