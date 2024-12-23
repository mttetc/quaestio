import { QAList } from "@/components/qa/qa-list";

export default function QAPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Q&A Library</h2>
                <p className="text-muted-foreground">View and manage your Q&A collection</p>
            </div>

            <QAList />
        </div>
    );
}
