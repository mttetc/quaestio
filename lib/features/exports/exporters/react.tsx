import { qaEntries } from "@/lib/core/db/schema";
import { InferSelectModel } from "drizzle-orm";

export function generateReactCode(qas: InferSelectModel<typeof qaEntries>[]): string {
    const qaItems = qas
        .map(
            (qa, index) => `
        <div key={${index}} className="qa-item">
            <div className="question">
                {${JSON.stringify(qa.question)}}
                <span className={\`importance \${${JSON.stringify(qa.importance)}\}\`}>
                    {${JSON.stringify(qa.importance)}}
                </span>
                <span className="confidence">
                    {Math.round(${qa.confidence})}% confidence
                </span>
            </div>
            <div className="answer">{${JSON.stringify(qa.answer)}}</div>
            <div className="metadata">
                ${qa.metadata?.subject ? `<div>Subject: {${JSON.stringify(qa.metadata.subject)}}</div>` : ""}
                ${qa.category ? `<div>Category: {${JSON.stringify(qa.category)}}</div>` : ""}
                ${
                    qa.metadata?.date
                        ? `<div>Date: {new Date(${JSON.stringify(qa.metadata.date)}).toLocaleString()}</div>`
                        : ""
                }
            </div>
            ${
                qa.tags && qa.tags.length > 0
                    ? `
                <div className="tags">
                    {${JSON.stringify(qa.tags)}.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            `
                    : ""
            }
        </div>
    `
        )
        .join("");

    const styles = `
        .qa-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        .qa-title {
            color: #2563eb;
            font-size: 2.25rem;
            margin-bottom: 1rem;
        }
        .qa-description {
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
    `;

    return `
        import React from "react";

        export default function QAExport() {
            return (
                <div className="qa-container">
                    <style>{${"`" + styles + "`"}}</style>
                    <h1 className="qa-title">Q&A Export</h1>
                    ${qaItems}
                </div>
            );
        }
    `;
}
