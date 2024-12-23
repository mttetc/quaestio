import { WebsiteAnalyzer } from "@/components/analysis/website-analyzer";

export default function AnalysisPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Content Analysis</h2>
                <p className="text-muted-foreground">Analyze content gaps and improve your documentation</p>
            </div>

            <div className="grid gap-6">
                <WebsiteAnalyzer />
            </div>
        </div>
    );
}
