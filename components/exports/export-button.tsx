"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileDown, Code, FileText } from 'lucide-react';
import { ExportFormat } from '@/lib/exports/types';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

interface ExportButtonProps {
  dateRange?: {
    from: Date;
    to: Date;
  };
}

async function downloadExport(url: string, filename: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Export failed');

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(a);
}

export function ExportButton({ dateRange }: ExportButtonProps) {
  const { toast } = useToast();

  const { mutate: exportData, isPending } = useMutation({
    mutationFn: async (format: ExportFormat) => {
      if (!dateRange?.from || !dateRange?.to) {
        throw new Error('Please select a date range first');
      }

      const params = new URLSearchParams({
        format,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });

      const url = `/api/exports?${params}`;
      const filename = `qa-export.${format}`;
      await downloadExport(url, filename);
      return format;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Export completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate export",
        variant: "destructive",
      });
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isPending}>
          <Download className="mr-2 h-4 w-4" />
          {isPending ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportData('csv')}>
          <FileDown className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('html')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('react')}>
          <Code className="mr-2 h-4 w-4" />
          Export as React Component
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}