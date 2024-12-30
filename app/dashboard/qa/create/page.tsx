import { QAForm } from "@/components/qa/qa-form";
import { redirect } from "next/navigation";

export default function CreateQAPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Q&A</h2>
        <p className="text-muted-foreground">Create a new Q&A entry manually</p>
      </div>
      <QAForm onSuccess={() => redirect('/dashboard/qa')} />
    </div>
  );
} 