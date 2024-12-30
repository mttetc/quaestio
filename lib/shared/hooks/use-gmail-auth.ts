"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

async function initiateGmailAuth() {
  const response = await fetch('/api/auth/google');
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to connect email account');
  }

  if (!data.url) {
    throw new Error('Authentication URL not received');
  }

  return data.url;
}

export function useGmailAuth() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: initiateGmailAuth,
    onSuccess: (url) => {
      window.location.href = url;
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