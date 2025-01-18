"use client";

import { QAList } from "@/components/qa/qa-list";
import { PageHeader } from "@/components/ui/page-header";
import { PAGE_HEADERS } from "@/lib/constants/text";
import { Suspense } from "react";
import { ViewProps } from "@/lib/types/components";

export function QAView({ className }: ViewProps) {
    return (
        <div className={`space-y-6 ${className ?? ""}`}>
            <PageHeader 
                title={PAGE_HEADERS.QA_LIBRARY.title} 
                description={PAGE_HEADERS.QA_LIBRARY.description} 
            />
            <Suspense fallback={<div className="flex justify-center p-8">Loading Q&As...</div>}>
                <QAList />
            </Suspense>
        </div>
    );
}
