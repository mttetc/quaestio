import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QA } from '@/lib/shared/schemas/qa';

export function useQAList() {
  return useQuery({
    queryKey: ['qa'],
    queryFn: async () => {
      const response = await fetch('/api/qa');
      return response.json() as Promise<QA[]>;
    },
  });
}

export function useCreateQA() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (qa: Omit<QA, 'id'>) => {
      const response = await fetch('/api/qa', {
        method: 'POST',
        body: JSON.stringify(qa),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa'] });
    },
  });
}

export function useUpdateQA() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (qa: QA) => {
      const response = await fetch(`/api/qa/${qa.id}`, {
        method: 'PUT',
        body: JSON.stringify(qa),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa'] });
    },
  });
}

export function useDeleteQA() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/qa/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa'] });
    },
  });
} 