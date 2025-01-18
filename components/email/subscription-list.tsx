"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useReadSubscriptions } from "@/lib/features/email/hooks/use-read-subscriptions";
import { useUnsubscribe } from "@/lib/features/email/hooks/use-unsubscribe";
import type { EmailSubscription } from "@/lib/features/email/schemas/subscription";

export function SubscriptionList() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { data: subscriptions } = useReadSubscriptions();
    const { mutate: unsubscribe, isPending: isUnsubscribing } = useUnsubscribe();
    const { toast } = useToast();

    const handleUnsubscribe = async () => {
        if (!selectedIds.length) return;

        unsubscribe(selectedIds, {
            onSuccess: () => {
                toast({
                    title: "Unsubscribed",
                    description: "Successfully unsubscribed from selected emails.",
                });
                setSelectedIds([]);
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to unsubscribe. Please try again.",
                    variant: "destructive",
                });
            },
        });
    };

    const toggleSubscription = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    if (!subscriptions?.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Subscriptions Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Connect your email account to start managing your subscriptions.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold">Your Subscriptions</h3>
                    <p className="text-sm text-muted-foreground">
                        Select subscriptions to unsubscribe from
                    </p>
                </div>
                <Button
                    onClick={handleUnsubscribe}
                    disabled={!selectedIds.length || isUnsubscribing}
                >
                    {isUnsubscribing ? "Unsubscribing..." : "Unsubscribe"}
                </Button>
            </div>

            <div className="grid gap-4">
                {subscriptions.map((subscription) => (
                    <Card key={subscription.id}>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <Checkbox
                                    id={subscription.id}
                                    checked={selectedIds.includes(subscription.id)}
                                    onCheckedChange={() => toggleSubscription(subscription.id)}
                                />
                                <div className="flex-1 space-y-1">
                                    <p className="font-medium">{subscription.sender}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {subscription.email}
                                    </p>
                                </div>
                                <Badge>{subscription.type}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
