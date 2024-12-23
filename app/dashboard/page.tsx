"use client";

import { ExtractionForm } from "@/components/qa/extraction-form";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Q&A Library</h2>
                <p className="text-muted-foreground">Extract and analyze Q&As from your email conversations</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ExtractionForm />
            </div>
        </div>
    );
}
