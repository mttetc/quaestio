"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/shared/api";

async function initiateGmailAuth() {
  return api.get<{ url: string }>('/api/auth/google');
}

export function useGmailAuth() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: initiateGmailAuth,
    onSuccess: (data) => {
      if (!data.url) {
        throw new Error('Authentication URL not received');
      }
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to connect email account. Please try again.",
        variant: "destructive",
      });
    },
  });
} 