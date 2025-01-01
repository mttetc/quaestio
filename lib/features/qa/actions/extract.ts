'use server';

import { getCurrentUser } from "@/lib/core/auth";
import { createQA } from "./crud";
import { extractQAsFromEmails } from "@/lib/features/email/actions/extraction";
import { ExtractFormState } from "./types";

export async function extractAction(prevState: ExtractFormState, formData: FormData): Promise<ExtractFormState> {
    try {
        const user = await getCurrentUser();
        const emailId = formData.get('emailId') as string;
        const dateRange = formData.get('dateRange') as string;
        const { from, to } = JSON.parse(dateRange);

        const qas = await extractQAsFromEmails(emailId, new Date(from), new Date(to));
        let failedCount = 0;

        for (const qa of qas) {
            try {
                await createQA(qa);
            } catch (error) {
                failedCount++;
            }
        }

        return {
            status: {
                count: qas.length,
                failedEmails: failedCount || undefined
            }
        };
    } catch (error) {
        return {
            status: {
                error: error instanceof Error ? error.message : 'Failed to extract Q&As'
            }
        };
    }
} 