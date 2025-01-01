"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function QuickActions() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
                <Link 
                    href="/dashboard/extract" 
                    className="flex items-center justify-between p-3 text-sm rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                    <span>Extract Q&As from Emails</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                    href="/dashboard/qa/create" 
                    className="flex items-center justify-between p-3 text-sm rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                    <span>Create Q&A Manually</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
} 