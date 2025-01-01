import { useMutation } from '@tanstack/react-query';

export interface ExportOptions {
  format: 'csv' | 'json';
  type: 'qa' | 'analytics';
  startDate?: string;
  endDate?: string;
}

export function useExport() {
  return useMutation({
    mutationFn: async (options: ExportOptions) => {
      const response = await fetch('/api/exports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${options.type}-${new Date().toISOString()}.${options.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
} 