"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Globe, Loader2 } from "lucide-react";
import { ContentGapsDisplay } from "@/components/analysis/content-gaps-display";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { analyzeWebsite, WebsiteAnalysisState } from "@/lib/features/analytics/actions/website-analysis";

function AnalyzeButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
            ) : (
                <>
                    <Globe className="mr-2 h-4 w-4" />
                    Analyze
                </>
            )}
        </Button>
    );
}

export function WebsiteAnalyzer() {
    const { toast } = useToast();
    const [state, formAction] = useActionState<WebsiteAnalysisState, FormData>(analyzeWebsite, {});

    useEffect(() => {
        if (state?.error) {
            toast({
                title: "Error",
                description: state.error,
                variant: "destructive",
            });
        }
    }, [state?.error, toast]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Website Content Analysis</CardTitle>
                    <CardDescription>Compare your Q&As with website content to identify gaps</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="flex gap-2">
                            <Input type="url" name="url" placeholder="Enter website URL" required />
                            <AnalyzeButton />
                        </div>
                    </form>
                </CardContent>
            </Card>

            {state?.analysis && <ContentGapsDisplay analysis={state.analysis} />}
        </div>
    );
}
