"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { Mail, Loader2 } from "lucide-react";
import { extractQAs } from "@/lib/actions/qa";
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

    const emailId = (formData.get("emailId") as string) || prevState.emailId;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    const dateRange = {
        from: startDate ? new Date(startDate) : prevState.dateRange.from,
        to: endDate ? new Date(endDate) : prevState.dateRange.to,
    };

    const result = await extractQAs(formData);

    return {
        emailId,
        dateRange,
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

    // Show toast when status changes
    useEffect(() => {
        if (state.status?.error) {
            toast({
                title: "Error",
                description: state.status.error,
                variant: "destructive",
            });
        } else if (state.status?.success) {
            toast({
                title: "Success",
                description: `Extracted ${state.status.count} Q&As from your emails`,
            });
        }
    }, [state.status, toast]);

    const handleSubmit = (formData: FormData) => {
        formData.append("emailId", state.emailId);
        formData.append("startDate", state.dateRange.from?.toISOString() || "");
        formData.append("endDate", state.dateRange.to?.toISOString() || "");
        dispatch(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Extract Q&As</CardTitle>
                <CardDescription>Select an email account and date range to extract Q&As</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Account</label>
                        <Select
                            value={state.emailId}
                            onValueChange={(value) => {
                                const formData = new FormData();
                                formData.append("emailId", value);
                                formData.append("startDate", state.dateRange.from?.toISOString() || "");
                                formData.append("endDate", state.dateRange.to?.toISOString() || "");
                                dispatch(formData);
                            }}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an email account">
                                    {emailAccounts?.find((acc: EmailAccount) => acc.id === state.emailId)?.email}
                                </SelectValue>
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
                        <label className="text-sm font-medium">Date Range</label>
                        <DateRangePicker
                            dateRange={state.dateRange}
                            onDateRangeChange={(range) => {
                                const formData = new FormData();
                                formData.append("emailId", state.emailId);
                                formData.append("startDate", range.from?.toISOString() || "");
                                formData.append("endDate", range.to?.toISOString() || "");
                                dispatch(formData);
                            }}
                        />
                    </div>

                    <ExtractButton />
                </form>
            </CardContent>
        </Card>
    );
}
