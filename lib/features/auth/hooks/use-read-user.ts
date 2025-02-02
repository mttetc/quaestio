"use client";

import { updateUser } from "@/lib/features/auth/actions/updateUser";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../actions/completeOnboarding";

export function useReadUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: readUser,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
}

export function useCompleteOnboarding() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        retry: false,
        onError: (error) => {
            console.error("Failed to complete onboarding:", error);
        },
    });
}
