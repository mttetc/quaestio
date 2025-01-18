"use client";

import { WebsiteAnalyzer } from "@/components/analysis/website-analyzer";
import { PageHeader } from "@/components/ui/page-header";
import { ViewProps } from "@/lib/types/components";

export function AnalysisView({ className }: ViewProps) {
    return (
        <div className={`space-y-6 ${className ?? ""}`}>
            <PageHeader 
                title="Content Analysis" 
                description="Analyze content gaps and improve your documentation" 
            />
            <WebsiteAnalyzer />
        </div>
    );
}
