import { useQuery } from '@tanstack/react-query';

export interface Solution {
  id: string;
  title: string;
  content: string;
  confidence: number;
  source: string;
}

export function useSolutionSuggestions(question: string) {
  return useQuery<Solution[]>({
    queryKey: ['solutions', question],
    queryFn: async () => {
      const response = await fetch(`/api/qa/solutions?question=${encodeURIComponent(question)}`);
      return response.json();
    },
    enabled: !!question,
  });
} 