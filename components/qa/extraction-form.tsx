"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Mail, Loader2 } from "lucide-react";
import { extractQAs } from "@/lib/features/qa/actions/qa";
import { DateRange } from "react-day-picker";
import { useEffect } from "react";

interface EmailAccount {
    id: string;
    email: string;
    provider: string;
}

interface FormState {
    emailId: string;
    dateRange: DateRange;
    status?: {
        error?: string;
        success?: boolean;
        count?: number;
        failureReasons?: string[];
        failedEmails?: number;
    };
}

function ExtractButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting...
                </>
            ) : (
                "Extract Q&As"
            )}
        </Button>
    );
}

const initialState: FormState = {
    emailId: "",
    dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
    },
};

async function formAction(prevState: FormState, formData: FormData): Promise<FormState> {
    "use server";

    const emailId = formData.get("emailId") as string;
    const dateRange = formData.get("dateRange") as string;
    const range = dateRange ? JSON.parse(dateRange) as DateRange : prevState.dateRange;

    const result = await extractQAs(formData);

    return {
        emailId: emailId || prevState.emailId,
        dateRange: range,
        status: result.error ? { error: result.error } : { success: true, count: result.count },
    };
}

export function ExtractionForm() {
    const { toast } = useToast();
    const [state, dispatch] = useFormState(formAction, initialState);

    const { data: emailAccounts, isLoading } = useQuery({
        queryKey: ["emailAccounts"],
        queryFn: async () => {
            const response = await fetch("/api/email/accounts");
            if (!response.ok) throw new Error("Failed to fetch email accounts");
            return response.json();
        },
    });

    useEffect(() => {
        if (state.status?.error) {
            toast({
                title: "Error",
                description: state.status.error,
                variant: "destructive",
            });
            
            // If there are failure details, show them in a separate toast
            if (state.status.failureReasons?.length) {
                toast({
                    title: `${state.status.failedEmails} Emails Failed`,
                    description: (
                        <div className="mt-2 max-h-[200px] overflow-y-auto">
                            {state.status.failureReasons.map((reason, i) => (
                                <p key={i} className="text-sm mt-1">{reason}</p>
                            ))}
                        </div>
                    ),
                    variant: "destructive",
                });
            }
        } else if (state.status?.success) {
            const message = state.status.failedEmails
                ? `Extracted ${state.status.count} Q&As. ${state.status.failedEmails} emails failed processing.`
                : `Extracted ${state.status.count} Q&As from your emails`;
            
            toast({
                title: "Success",
                description: message,
            });
        }
    }, [state.status, toast]);

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
