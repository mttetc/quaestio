import { DocumentationBuilder } from "@/components/docs/documentation-builder";

export default function DocumentationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Documentation</h2>
                <p className="text-muted-foreground">Create and manage your knowledge base</p>
            </div>

            <DocumentationBuilder />
        </div>
    );
}
