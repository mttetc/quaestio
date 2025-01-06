import { openai } from "./config";
import { QA } from "@/lib/schemas/qa";

export interface QuestionCluster {
    mainQuestion: string;
    similarQuestions: string[];
    averageConfidence: number;
    totalOccurrences: number;
    tags: string[];
}

async function getEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function clusterSimilarQuestions(questions: QA[]): Promise<QuestionCluster[]> {
    // Get embeddings for all questions
    const embeddings = await Promise.all(questions.map((q) => getEmbedding(q.question)));

    const clusters: Map<string, QuestionCluster> = new Map();
    const SIMILARITY_THRESHOLD = 0.85;

    for (let i = 0; i < questions.length; i++) {
        const qa = questions[i];
        let foundCluster = false;

        // Check similarity with existing clusters
        for (const [mainQuestion, cluster] of clusters.entries()) {
            const mainEmbedding = embeddings[questions.findIndex((q) => q.question === mainQuestion)];
            const currentEmbedding = embeddings[i];
            const similarity = cosineSimilarity(mainEmbedding, currentEmbedding);

            if (similarity > SIMILARITY_THRESHOLD) {
                cluster.similarQuestions.push(qa.question);
                cluster.averageConfidence =
                    (cluster.averageConfidence * cluster.totalOccurrences + qa.confidence) /
                    (cluster.totalOccurrences + 1);
                cluster.totalOccurrences++;
                // Merge tags
                qa.tags.forEach((tag) => {
                    if (!cluster.tags.includes(tag)) {
                        cluster.tags.push(tag);
                    }
                });
                foundCluster = true;
                break;
            }
        }

        if (!foundCluster) {
            clusters.set(qa.question, {
                mainQuestion: qa.question,
                similarQuestions: [],
                averageConfidence: qa.confidence,
                totalOccurrences: 1,
                tags: [...qa.tags],
            });
        }
    }

    return Array.from(clusters.values());
}
