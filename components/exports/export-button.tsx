"use client";

import { Button } from "@/components/ui/button";
import type { ExportOptions } from "@/lib/features/exports/api";
import { useExport } from "@/lib/features/exports/hooks/use-export";

interface ExportButtonProps {
    options: ExportOptions;
    children: React.ReactNode;
}

export function ExportButton({ options, children }: ExportButtonProps) {
    const { mutate: exportData, isPending } = useExport();

    return (
        <Button onClick={() => exportData(options)} disabled={isPending} variant="outline" size="sm">
            {isPending ? "Exporting..." : children}
        </Button>
    );
}
