"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useQAs } from "@/services/qa/hooks/use-qa";

export function RecentActivity() {
    const dateRange = {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        to: new Date()
    };

    const { data: qas, isLoading } = useQAs({
        dateRange,
        // Sort by most recent first is handled by the service
    });

    if (isLoading) {
        return <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-start space-x-3">
                    <div className="h-6 w-6 rounded bg-gray-200" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>;
    }

    if (!qas?.length) {
        return (
            <div className="text-center text-muted-foreground py-6">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No activity in the last 30 days</p>
            </div>
        );
    }

    // Show only the 5 most recent QAs
    const recentQAs = qas.slice(0, 5);

    return (
        <div className="space-y-4">
            {recentQAs.map((qa) => (
                <Link 
                    key={qa.id}
                    href={`/dashboard/qa/${qa.id}`}
                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                    <MessageSquare className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium line-clamp-1">{qa.question}</p>
                        <p className="text-xs text-muted-foreground">
                            {qa.metadata?.date && formatDistanceToNow(new Date(qa.metadata.date), { addSuffix: true })}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
} 