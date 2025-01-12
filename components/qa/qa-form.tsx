"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRef, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitQA } from "@/lib/features/qa/actions/submit-qa";
import { qaEntries } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import type { QAFieldErrors } from "@/lib/features/qa/schemas/qa";

interface QAFormProps {
    qa?: InferSelectModel<typeof qaEntries>;
    onSuccess?: () => void;
    className?: string;
}

interface QAFormState {
    error?: string;
    message?: string;
    fieldErrors: QAFieldErrors;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Q&A"}
        </Button>
    );
}

const initialState: QAFormState = {
    error: undefined,
    message: undefined,
    fieldErrors: {},
};

export function QAForm({ qa, onSuccess, className }: QAFormProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [confidence, setConfidence] = useState(qa?.confidence ?? 100);
    const [state, formAction] = useFormState(
        (prevState: QAFormState, formData: FormData) => submitQA(qa, prevState, formData),
        initialState
    );

    useEffect(() => {
        if (state.message) {
            toast({ title: "Success", description: state.message });
            if (!qa) formRef.current?.reset();
            onSuccess?.();
        }
        if (state.error) {
            toast({
                title: "Error",
                description: state.error,
                variant: "destructive",
            });
        }
    }, [state, toast, qa, onSuccess]);

    return (
        <form ref={formRef} action={formAction} className={className}>
            <input type="hidden" name="id" value={qa?.id} />
            <Card>
                <CardHeader>
                    <CardTitle>{qa ? "Edit Q&A" : "Create Q&A"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                            id="question"
                            name="question"
                            placeholder="Enter the question"
                            defaultValue={qa?.question}
                            required
                            aria-invalid={!!state.fieldErrors.question}
                            aria-errormessage="question-error"
                        />
                        {state.fieldErrors.question?.map((error: string, i: number) => (
                            <p key={i} id="question-error" className="text-sm text-destructive mt-1">
                                {error}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                            id="answer"
                            name="answer"
                            placeholder="Enter the answer"
                            defaultValue={qa?.answer}
                            required
                            aria-invalid={!!state.fieldErrors.answer}
                            aria-errormessage="answer-error"
                        />
                        {state.fieldErrors.answer?.map((error: string, i: number) => (
                            <p key={i} id="answer-error" className="text-sm text-destructive mt-1">
                                {error}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            name="tags"
                            placeholder="Enter tags (comma separated)"
                            defaultValue={qa?.tags?.join(", ")}
                            aria-invalid={!!state.fieldErrors.tags}
                            aria-errormessage="tags-error"
                        />
                        {state.fieldErrors.tags?.map((error: string, i: number) => (
                            <p key={i} id="tags-error" className="text-sm text-destructive mt-1">
                                {error}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="importance">Importance</Label>
                        <Select name="importance" defaultValue={qa?.importance ?? "medium"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select importance" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                        {state.fieldErrors.importance?.map((error: string, i: number) => (
                            <p key={i} className="text-sm text-destructive mt-1">
                                {error}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Confidence ({confidence}%)</Label>
                        <input type="hidden" name="confidence" value={confidence} />
                        <Slider
                            value={[confidence]}
                            onValueChange={([value]: number[]) => setConfidence(value)}
                            min={0}
                            max={100}
                            step={1}
                        />
                        {state.fieldErrors.confidence?.map((error: string, i: number) => (
                            <p key={i} className="text-sm text-destructive mt-1">
                                {error}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="Enter subject"
                            defaultValue={qa?.metadata?.subject}
                            aria-invalid={!!state.fieldErrors["metadata.subject"]}
                            aria-errormessage="subject-error"
                        />
                        {state.fieldErrors["metadata.subject"]?.map((error: string, i: number) => (
                            <p key={i} id="subject-error" className="text-sm text-destructive mt-1">
                                {error}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="context">Context</Label>
                        <Textarea
                            id="context"
                            name="context"
                            placeholder="Enter additional context"
                            defaultValue={qa?.metadata?.context ?? ""}
                            aria-invalid={!!state.fieldErrors["metadata.context"]}
                            aria-errormessage="context-error"
                        />
                        {state.fieldErrors["metadata.context"]?.map((error: string, i: number) => (
                            <p key={i} id="context-error" className="text-sm text-destructive mt-1">
                                {error}
                            </p>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    );
}
