import { ExtractionForm } from "@/components/qa/extraction-form";

export default function ExtractPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Extract Q&As</h2>
                <p className="text-muted-foreground">Extract Q&As from your email conversations</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ExtractionForm />
            </div>
        </div>
    );
}
