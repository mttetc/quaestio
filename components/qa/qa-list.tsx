"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { QAFilter } from "@/lib/features/qa/schemas/qa";
import { useReadQAs } from "@/lib/features/qa/hooks/use-read-qas";
import { Checkbox } from "@/components/ui/checkbox";
import { qaEntries } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

interface QAListProps {
    filter?: QAFilter;
    selectable?: boolean;
    selectedIds?: string[];
    onSelect?: (id: string) => void;
}

export function QAList({ filter, selectable, selectedIds = [], onSelect }: QAListProps) {
    const { data: qas, isLoading } = useReadQAs(filter);

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (!qas?.length) {
        return <div className="text-center text-muted-foreground">No Q&As found</div>;
    }

    return (
        <div className="space-y-4">
            {qas.map((qa) => (
                <Card key={qa.id} className="p-4">
                    <div className="flex items-start gap-4">
                        {selectable && (
                            <Checkbox checked={selectedIds.includes(qa.id)} onCheckedChange={() => onSelect?.(qa.id)} />
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold">{qa.question}</h3>
                            <p className="mt-2 text-muted-foreground">{qa.answer}</p>
                            {qa.tags && qa.tags.length > 0 && (
                                <div className="mt-2 flex gap-2">
                                    {qa.tags.map((tag) => (
                                        <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
