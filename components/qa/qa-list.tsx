"use client";

import { useReadQAs } from "@/lib/features/qa/hooks/use-read-qas";
import { useDeleteQA } from "@/lib/features/qa/hooks/use-delete-qa";
import { useUpdateQA } from "@/lib/features/qa/hooks/use-update-qa";
import { useToast } from "@/components/ui/use-toast";
import type { QAFilter } from "@/lib/features/qa/schemas/qa";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface QAListProps {
    filter?: QAFilter;
    selectable?: boolean;
    selectedIds?: string[];
    onSelect?: (id: string) => void;
}

type DialogState =
    | { type: "closed" }
    | { type: "edit"; id: string; question: string; answer: string }
    | { type: "delete"; id: string };

export function QAList({ filter, selectable, selectedIds = [], onSelect }: QAListProps) {
    const { data: qas } = useReadQAs(filter);
    const { mutate: deleteQA } = useDeleteQA();
    const { mutate: updateQA } = useUpdateQA();
    const { toast } = useToast();
    const [dialog, setDialog] = useState<DialogState>({ type: "closed" });

    const handleDelete = async (id: string) => {
        deleteQA(id, {
            onSuccess: () => {
                toast({
                    title: "Q&A deleted",
                    description: "The Q&A has been deleted successfully.",
                });
                setDialog({ type: "closed" });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to delete Q&A. Please try again.",
                    variant: "destructive",
                });
            },
        });
    };

    const handleUpdate = async (id: string, data: { question: string; answer: string }) => {
        updateQA(
            { id, qa: data },
            {
                onSuccess: () => {
                    toast({
                        title: "Q&A updated",
                        description: "The Q&A has been updated successfully.",
                    });
                    setDialog({ type: "closed" });
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Failed to update Q&A. Please try again.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    if (!qas?.length) {
        return <div className="text-center text-muted-foreground">No Q&As found</div>;
    }

    return (
        <div className="space-y-4">
            {qas.map((qa) => (
                <Card key={qa.id} className="p-4">
                    <div className="flex items-start gap-4">
                        {selectable && (
                            <Checkbox checked={selectedIds.includes(qa.id)} onCheckedChange={() => onSelect?.(qa.id)} />
                        )}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold">{qa.question}</h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setDialog({
                                                type: "edit",
                                                id: qa.id,
                                                question: qa.question,
                                                answer: qa.answer,
                                            })
                                        }
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDialog({ type: "delete", id: qa.id })}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <p className="mt-2 text-muted-foreground">{qa.answer}</p>
                            {qa.tags && qa.tags.length > 0 && (
                                <div className="mt-2 flex gap-2">
                                    {qa.tags.map((tag) => (
                                        <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            ))}

            {/* Edit Dialog */}
            <Dialog open={dialog.type === "edit"} onOpenChange={(open) => !open && setDialog({ type: "closed" })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Q&A</DialogTitle>
                        <DialogDescription>
                            Make changes to your Q&A here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    {dialog.type === "edit" && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="question" className="text-sm font-medium">
                                    Question
                                </label>
                                <Input
                                    id="question"
                                    value={dialog.question}
                                    onChange={(e) =>
                                        setDialog({
                                            ...dialog,
                                            question: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="answer" className="text-sm font-medium">
                                    Answer
                                </label>
                                <Textarea
                                    id="answer"
                                    value={dialog.answer}
                                    onChange={(e) =>
                                        setDialog({
                                            ...dialog,
                                            answer: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog({ type: "closed" })}>
                            Cancel
                        </Button>
                        {dialog.type === "edit" && (
                            <Button
                                onClick={() =>
                                    handleUpdate(dialog.id, {
                                        question: dialog.question,
                                        answer: dialog.answer,
                                    })
                                }
                            >
                                Save changes
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={dialog.type === "delete"} onOpenChange={(open) => !open && setDialog({ type: "closed" })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Q&A</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this Q&A? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog({ type: "closed" })}>
                            Cancel
                        </Button>
                        {dialog.type === "delete" && (
                            <Button variant="destructive" onClick={() => handleDelete(dialog.id)}>
                                Delete
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
