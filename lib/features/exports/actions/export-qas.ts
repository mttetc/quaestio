'use server';

import { exportData } from "@/lib/features/exports/api";
import { readQAs } from "@/lib/features/qa/queries/readQAs";

export type ExportQAsResult = {
    error?: string;
    success?: boolean;
};

export async function exportQAs(_: unknown, formData: FormData): Promise<ExportQAsResult> {
    try {
        const format = formData.get("format") as "csv" | "html" | "react";
        const qas = await readQAs();

        if (!qas?.length) {
            return {
                error: "You don't have any Q&As to export yet.",
                success: false,
            };
        }

        const { data, extension } = await exportData({ format });
        return { success: true };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to export Q&As",
            success: false,
        };
    }
}
