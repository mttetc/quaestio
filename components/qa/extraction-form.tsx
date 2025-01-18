"use client";

import { useFormState } from "react-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { ExtractButton } from "@/components/qa/extract-button";
import { extractQA } from "@/lib/features/qa/actions/extract";
import { useReadEmailAccounts } from "@/lib/features/email/hooks/use-read-accounts";
import { emailAccounts } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import { DEFAULT_DATE_RANGE } from "@/lib/features/analytics/hooks/use-date-range";
import { DateRange } from "react-day-picker";

type EmailAccount = InferSelectModel<typeof emailAccounts>;

type ExtractFormSuccess = {
    type: "success";
    status: {
        count: number;
    };
};

type ExtractFormError = {
    type: "error";
    status: {
        error: string;
    };
};

type ExtractFormInitial = {
    type: "initial";
    status: undefined;
};

type ExtractFormState = ExtractFormSuccess | ExtractFormError | ExtractFormInitial;

const extractInitialState: ExtractFormState = { type: "initial", status: undefined };

const extractAction = async (state: ExtractFormState, formData: FormData): Promise<ExtractFormState> => {
    try {
        const emailId = formData.get("emailId") as string;
        const dateRangeStr = formData.get("dateRange") as string;
        if (!emailId || !dateRangeStr) {
            return {
                type: "error",
                status: { error: "Email account and date range are required" },
            };
        }

        const dateRange = JSON.parse(dateRangeStr) as DateRange;
        if (!dateRange.from || !dateRange.to) {
            return {
                type: "error",
                status: { error: "Invalid date range" },
            };
        }

        const qa = await extractQA(emailId, "", "", dateRangeStr);
        return {
            type: "success",
            status: { count: 1 },
        };
    } catch (error) {
        return {
            type: "error",
            status: {
                error: error instanceof Error ? error.message : "Failed to extract Q&A",
            },
        };
    }
};

export function ExtractionForm() {
    const { toast } = useToast();
    const [state, dispatch] = useFormState(extractAction, extractInitialState);
    const { data: emailAccounts, isLoading } = useReadEmailAccounts();

    useEffect(() => {
        if (state.type === "error") {
            toast({
                title: "Error",
                description: state.status.error,
                variant: "destructive",
            });
        } else if (state.type === "success") {
            toast({
                title: "Success",
                description: `Extracted ${state.status.count} Q&As from your emails`,
            });
        }
    }, [toast, state]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Extract Q&As</CardTitle>
                <CardDescription>Select an email account and date range to extract Q&As</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form action={dispatch} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="emailId" className="text-sm font-medium">
                            Email Account
                        </label>
                        <Select name="emailId" disabled={isLoading}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an email account" />
                            </SelectTrigger>
                            <SelectContent>
                                {emailAccounts?.map((account: EmailAccount) => (
                                    <SelectItem key={account.id} value={account.id}>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {account.email}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="dateRange" className="text-sm font-medium">
                            Date Range
                        </label>
                        <DatePickerWithRange id="dateRange" name="dateRange" />
                    </div>

                    <ExtractButton />
                </form>
            </CardContent>
        </Card>
    );
}
