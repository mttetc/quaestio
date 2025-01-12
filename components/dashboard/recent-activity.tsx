"use client";

import { Card } from "@/components/ui/card";
import { useReadQAs } from "@/lib/features/qa/hooks/use-read-qas";
import { Loader2 } from "lucide-react";

export function RecentActivity() {
    const { data: qas, isLoading } = useReadQAs({ limit: 5 });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!qas?.length) {
        return <Card className="p-8 text-center text-muted-foreground">No recent activity</Card>;
    }

    return (
        <div className="space-y-4">
            {qas.map((qa) => {
                return (
                    <Card key={qa.id} className="p-4">
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
                    </Card>
                );
            })}
        </div>
    );
}
