export interface QAExtractResult {
    success: boolean;
    error?: string;
    processedEmails: number;
    extractedQAs: number;
}

export interface ExtractFormState {
    status?: {
        count?: number;
        error?: string;
        failedEmails?: number;
    };
    dateRange?: {
        from: Date;
        to: Date;
    };
} 