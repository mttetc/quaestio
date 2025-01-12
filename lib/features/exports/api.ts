"use server";

import { z } from "zod";
import { db } from "@/lib/core/db";
import { qaEntries, type QAMetadata } from "@/lib/core/db/schema";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { eq } from "drizzle-orm";
import { generateCSV } from "./exporters/csv";
import { generateHTML } from "./exporters/html";
import { generateReactCode } from "./exporters/react";

export const exportOptionsSchema = z.object({
    format: z.enum(["csv", "html", "react"]),
});

export type ExportOptions = z.infer<typeof exportOptionsSchema>;

export async function exportData(options: ExportOptions): Promise<{ data: Blob; extension: string }> {
    const data = await exportQAs(options.format);
    const mimeType = {
        csv: "text/csv",
        html: "text/html",
        react: "text/javascript",
    }[options.format];

    return {
        data: new Blob([data], { type: mimeType }),
        extension: options.format === "react" ? "jsx" : options.format,
    };
}

export async function exportQAs(format: ExportOptions["format"] = "csv") {
    const user = await readUser();

    const qas = await db.query.qaEntries.findMany({
        where: eq(qaEntries.userId, user.id),
    });

    switch (format) {
        case "csv":
            return generateCSV(qas);
        case "html":
            return generateHTML(qas);
        case "react":
            return generateReactCode(qas);
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }
}
