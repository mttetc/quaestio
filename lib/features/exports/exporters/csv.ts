import { qaEntries } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export function generateCSV(qas: InferSelectModel<typeof qaEntries>[]): string {
    const header = "Question,Answer,Importance,Confidence,Tags,Date,Subject,Category\n";
    const rows = qas.map((qa) => {
        const tags = qa.tags?.join(";") ?? "";
        const subject = qa.metadata?.subject ?? "";
        const category = qa.category ?? "";
        const date = qa.metadata?.date?.toISOString() ?? new Date().toISOString();

        const fields = [qa.question, qa.answer, qa.importance, String(qa.confidence), tags, date, subject, category];

        return fields.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",");
    });

    return header + rows.join("\n");
}
