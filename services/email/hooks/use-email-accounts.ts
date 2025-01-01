import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/shared/api";

export interface EmailAccount {
  id: string;
  email: string;
  provider: string;
  lastSynced?: string;
}

export function useEmailAccounts() {
  return useQuery({
    queryKey: ["emailAccounts"],
    queryFn: async () => {
      return api.get<EmailAccount[]>("/api/email/accounts");
    },
  });
} 