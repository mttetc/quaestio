import { useQuery } from "@tanstack/react-query";

export interface LinkedEmail {
  id: string;
  email: string;
  provider: string;
  lastSynced?: string;
}

export function useLinkedEmails() {
  return useQuery<LinkedEmail[]>({
    queryKey: ["linked-emails"],
    queryFn: async () => {
      const response = await fetch("/api/settings/linked-emails");
      return response.json();
    },
  });
} 