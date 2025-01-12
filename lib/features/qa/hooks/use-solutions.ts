import { useQuery } from "@tanstack/react-query";
import { openai } from "@/lib/infrastructure/ai/config";
import { readQAs } from "../queries/readQAs";

interface SolutionSuggestion {
    id: string;
    title: string;
    content: string;
    confidence: number;
    source?: string;
}

export function useSolutionSuggestions(question: string) {
    return useQuery({
        queryKey: ["solutions", question],
        queryFn: async () => {
            // Get all QAs
            const qas = await readQAs();

            // Get embeddings for the question
            const questionEmbedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: question,
            });

            // Get embeddings for all QAs
            const qaEmbeddings = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: qas.map((qa) => qa.question),
            });

            // Calculate cosine similarity and sort by score
            const similarities = qaEmbeddings.data
                .map((embedding, i) => {
                    const similarity = cosineSimilarity(questionEmbedding.data[0].embedding, embedding.embedding);
                    return {
                        qa: qas[i],
                        similarity,
                    };
                })
                .sort((a, b) => b.similarity - a.similarity);

            // Return top 3 most similar QAs
            return similarities.slice(0, 3).map(({ qa, similarity }) => ({
                id: qa.id,
                title: qa.question,
                content: qa.answer,
                confidence: similarity,
                source: qa.metadata?.subject,
            }));
        },
    });
}

function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
