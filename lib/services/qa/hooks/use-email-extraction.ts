import { useQuery } from "@tanstack/react-query";

export interface EmailAccount {
  id: string;
  email: string;
  provider: string;
  lastSynced?: string;
}

export function useEmailAccounts() {
  return useQuery<EmailAccount[]>({
    queryKey: ["email-accounts"],
    queryFn: async () => {
      const response = await fetch("/api/email/accounts");
      return response.json();
    },
  });
} 