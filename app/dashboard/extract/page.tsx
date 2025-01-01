import { ExtractionForm } from "@/components/qa/extraction-form";
import { PageHeader } from "@/components/ui/page-header";
import { PAGE_HEADERS } from "@/lib/shared/constants/text";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function ExtractPage() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title={PAGE_HEADERS.EXTRACT.title}
                description={PAGE_HEADERS.EXTRACT.description}
            />
            <div className="grid gap-6 md:grid-cols-2">
                <ErrorBoundary>
                    <ExtractionForm />
                </ErrorBoundary>
            </div>
        </div>
    );
}
