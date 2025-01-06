import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { QA, QAFilter, CreateQAInput, UpdateQAInput } from "@/lib/schemas/qa";
import { getQAs, createQA, updateQA, deleteQA } from "@/lib/features/qa/actions";

export function useQAs(filter?: QAFilter) {
    return useQuery({
        queryKey: ["qas", filter],
        queryFn: () => getQAs(filter),
    });
}

export function useCreateQA() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateQAInput) => createQA(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qas"] });
        },
    });
}

export function useUpdateQA() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateQAInput }) => updateQA(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qas"] });
        },
    });
}

export function useDeleteQA() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteQA(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qas"] });
        },
    });
}
