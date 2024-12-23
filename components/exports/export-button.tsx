"use client";

import { useState } from 'react';
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

interface ExportButtonProps {
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function ExportButton({ dateRange }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: ExportFormat) => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Error",
        description: "Please select a date range first",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        format,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });

      const response = await fetch(`/api/exports?${params}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 
                      `qa-export.${format}`;

      // Create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Export completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate export",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileDown className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('html')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('react')}>
          <Code className="mr-2 h-4 w-4" />
          Export as React Component
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}