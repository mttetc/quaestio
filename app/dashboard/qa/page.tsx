import { QAList } from "@/components/qa/qa-list";
import { PageHeader } from "@/components/ui/page-header";
import { PAGE_HEADERS } from "@/lib/constants/text";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function QAPage() {
    return (
        <div className="space-y-6">
            <PageHeader title={PAGE_HEADERS.QA_LIBRARY.title} description={PAGE_HEADERS.QA_LIBRARY.description} />
            <ErrorBoundary>
                <QAList />
            </ErrorBoundary>
        </div>
    );
}
