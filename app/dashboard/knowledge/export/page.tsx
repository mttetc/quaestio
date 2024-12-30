import { QAExport } from "@/components/qa/qa-export";

export default function QAExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Q&A Export</h2>
        <p className="text-muted-foreground">Export your Q&As in various formats</p>
      </div>
      <QAExport />
    </div>
  );
} 