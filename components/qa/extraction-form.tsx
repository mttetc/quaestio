"use client";

import { useFormState } from "react-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { ExtractButton } from "@/components/qa/extract-button";
import { extractAction } from "@/lib/features/qa/actions/extract";
import { ExtractFormState } from "@/lib/features/qa/actions/types";
import { useEmailAccounts } from "@/services/email/hooks";
import type { EmailAccount } from "@/services/email/api";

const extractInitialState: ExtractFormState = { status: undefined };

export function ExtractionForm() {
    const { toast } = useToast();
    const [state, dispatch] = useFormState(extractAction, extractInitialState);
    const { data: emailAccounts, isLoading } = useEmailAccounts();

    // Handle notifications based on state changes
    if (state.status?.error) {
        toast({
            title: "Error",
            description: state.status.error,
            variant: "destructive",
        });
    } else if (state.status?.count) {
        const message = state.status.failedEmails
            ? `Extracted ${state.status.count} Q&As. ${state.status.failedEmails} emails failed processing.`
            : `Extracted ${state.status.count} Q&As from your emails`;
        
        toast({
            title: "Success",
            description: message,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Extract Q&As</CardTitle>
                <CardDescription>Select an email account and date range to extract Q&As</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form action={dispatch} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="emailId" className="text-sm font-medium">Email Account</label>
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
                        <label htmlFor="dateRange" className="text-sm font-medium">Date Range</label>
                        <DatePickerWithRange
                            id="dateRange"
                            name="dateRange"
                            date={state.dateRange}
                        />
                    </div>

                    <ExtractButton />
                </form>
            </CardContent>
        </Card>
    );
}
