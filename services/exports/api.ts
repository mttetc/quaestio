import { api } from "@/lib/shared/api";

export interface ExportOptions {
    format: 'csv' | 'json';
    type: 'qa' | 'analytics';
    startDate?: string;
    endDate?: string;
}

export async function exportData(options: ExportOptions) {
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

    return response.blob();
} 