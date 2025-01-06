"use client";

import type { QAFilter } from "@/lib/schemas/qa";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useQAs } from "@/services/qa/hooks/use-qa";

interface QAListProps {
    filter?: QAFilter;
    className?: string;
    selectable?: boolean;
    name?: string;
    selectedIds?: string[];
}

export function QAList({ filter, className, selectable, name, selectedIds }: QAListProps) {
    const { data: qas, isLoading, error } = useQAs(filter);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Failed to load Q&As
            </div>
        );
    }

    if (!qas?.length) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No Q&As found</div>
        );
    }

    return (
        <div className={className}>
            {qas.map((qa) => (
                <Card key={qa.id} className="mb-4">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            {selectable && (
                                <Checkbox name={name} value={qa.id} checked={selectedIds?.includes(qa.id)} />
                            )}
                            <div className="flex-1">
                                <div className="mb-2">
                                    <h3 className="text-lg font-semibold">{qa.question}</h3>
                                    <p className="text-sm text-muted-foreground">{qa.answer}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {qa.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>Confidence: {qa.confidence}%</span>
                                    <span>Importance: {qa.importance}</span>
                                    {qa.responseTimeHours && <span>Response Time: {qa.responseTimeHours}h</span>}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
