"use client";

import { Button } from "@/components/ui/button";
import { useExport } from "@/services/exports/hooks";
import type { ExportOptions } from "@/services/exports/api";

interface ExportButtonProps {
  options: ExportOptions;
  children: React.ReactNode;
}

export function ExportButton({ options, children }: ExportButtonProps) {
  const { mutate: exportData, isPending } = useExport();

  return (
    <Button 
      onClick={() => exportData(options)} 
      disabled={isPending}
      variant="outline"
      size="sm"
    >
      {isPending ? "Exporting..." : children}
    </Button>
  );
}