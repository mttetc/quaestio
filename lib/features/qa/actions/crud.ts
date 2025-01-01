'use server';

import { db } from "@/services/db";
import { qaEntries } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/core/auth";
import { revalidatePath } from "next/cache";
import { QA, CreateQAInput, QAFilter } from "@/lib/shared/schemas/qa";

export async function getQAs(filter?: QAFilter) {
    const user = await getCurrentUser();
    return db.query.qaEntries.findMany({
        where: eq(qaEntries.userId, user.id),
        orderBy: (qaEntries, { desc }) => [desc(qaEntries.createdAt)]
    });
}

export async function createQA(input: CreateQAInput) {
    const user = await getCurrentUser();
    const [entry] = await db.insert(qaEntries)
        .values({
            ...input,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .returning();

    revalidatePath('/dashboard/qa');
    return entry;
}

export async function updateQA(id: string, qa: Partial<QA>) {
    const user = await getCurrentUser();
    const [entry] = await db.update(qaEntries)
        .set({
            ...qa,
            updatedAt: new Date()
        })
        .where(eq(qaEntries.id, id))
        .returning();

    revalidatePath('/dashboard/qa');
    return entry;
}

export async function deleteQA(id: string) {
    const user = await getCurrentUser();
    await db.delete(qaEntries)
        .where(eq(qaEntries.id, id));

    revalidatePath('/dashboard/qa');
}

interface FormState {
    error?: string;
    message?: string;
    fieldErrors: Record<string, string[]>;
}

export async function submitQA(qa: QA | undefined, prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const data = {
            question: formData.get('question') as string,
            answer: formData.get('answer') as string,
            importance: formData.get('importance') as 'high' | 'medium' | 'low',
            confidence: Number(formData.get('confidence')),
            tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
            metadata: {
                subject: formData.get('subject') as string,
                context: formData.get('context') as string,
                date: new Date()
            }
        };

        if (qa) {
            await updateQA(qa.id, { ...data, id: qa.id });
        } else {
            await createQA(data);
        }

        return { message: `Q&A ${qa ? 'updated' : 'created'} successfully`, fieldErrors: {} };
    } catch (error) {
        return { 
            error: error instanceof Error ? error.message : 'Failed to save Q&A',
            fieldErrors: {}
        };
    }
} 