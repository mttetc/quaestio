import { qaEntries } from "@/lib/core/db/schema";
import { InferSelectModel } from "drizzle-orm";

function generateStyles(): string {
    return `
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
                color: #333;
            }
            h1 {
                color: #2563eb;
                font-size: 2.25rem;
                margin-bottom: 1rem;
            }
            h2 {
                color: #1e40af;
                font-size: 1.5rem;
                margin-top: 2rem;
                margin-bottom: 1rem;
            }
            p {
                margin: 1rem 0;
            }
            .qa-item {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            .question {
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 0.5rem;
            }
            .answer {
                color: #334155;
            }
            .metadata {
                margin-top: 1rem;
                font-size: 0.875rem;
                color: #64748b;
            }
            .tags {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                margin-top: 0.5rem;
            }
            .tag {
                background: #e2e8f0;
                color: #475569;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.75rem;
            }
            .importance {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 500;
                margin-left: 0.5rem;
            }
            .importance.high {
                background: #fee2e2;
                color: #b91c1c;
            }
            .importance.medium {
                background: #fef3c7;
                color: #b45309;
            }
            .importance.low {
                background: #ecfdf5;
                color: #047857;
            }
            .confidence {
                display: inline-block;
                margin-left: 0.5rem;
                font-size: 0.75rem;
                color: #64748b;
            }
        </style>
    `;
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(date);
}

export function generateHTML(qas: InferSelectModel<typeof qaEntries>[]): string {
    const qaItems = qas
        .map(
            (qa) => `
        <div class="qa-item">
            <div class="question">
                ${qa.question}
                <span class="importance ${qa.importance}">${qa.importance}</span>
                <span class="confidence">${Math.round(qa.confidence)}% confidence</span>
            </div>
            <div class="answer">${qa.answer}</div>
            <div class="metadata">
                ${qa.metadata?.subject ? `<div>Subject: ${qa.metadata.subject}</div>` : ""}
                ${qa.category ? `<div>Category: ${qa.category}</div>` : ""}
                ${qa.metadata?.date ? `<div>Date: ${formatDate(qa.metadata.date)}</div>` : ""}
            </div>
            ${
                qa.tags && qa.tags.length > 0
                    ? `
                <div class="tags">
                    ${qa.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
            `
                    : ""
            }
        </div>
    `
        )
        .join("");

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Q&A Export</title>
            ${generateStyles()}
        </head>
        <body>
            <h1>Q&A Export</h1>
            ${qaItems}
        </body>
        </html>
    `;
}
