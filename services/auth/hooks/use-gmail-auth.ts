import { useMutation } from "@tanstack/react-query";

export interface GmailAuthResponse {
  url: string;
}

export interface GmailAuthError {
  message: string;
}

export function useGmailAuth() {
  return useMutation<GmailAuthResponse, GmailAuthError>({
    mutationFn: async () => {
      const response = await fetch("/api/auth/gmail", {
        method: "POST",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return response.json();
    },
  });
} 