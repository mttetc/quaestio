import { FAQBuilder } from "@/components/faq/faq-builder";

export default function FAQPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">FAQ Builder</h2>
                <p className="text-muted-foreground">Generate and export FAQs from your Q&A library</p>
            </div>

            <FAQBuilder />
        </div>
    );
}
