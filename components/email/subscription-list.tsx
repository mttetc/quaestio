"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useReadSubscriptions } from "@/lib/features/email/hooks/use-read-subscriptions";
import { useUnsubscribe } from "@/lib/features/email/hooks/use-unsubscribe";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export function SubscriptionList() {
    const { data: subscriptions, isLoading } = useReadSubscriptions();
    const { toast } = useToast();
    const { mutate: unsubscribe, isPending: isUnsubscribing } = useUnsubscribe();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSubscription = (id: string) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleUnsubscribe = async () => {
        if (selectedIds.length === 0) {
            toast({
                title: "No subscriptions selected",
                description: "Please select at least one subscription to unsubscribe from.",
            });
            return;
        }

        unsubscribe(selectedIds, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Successfully unsubscribed from selected emails.",
                });
                setSelectedIds([]);
            },
            onError: (error) => {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            },
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Loading...</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading email subscriptions...</p>
                </CardContent>
            </Card>
        );
    }

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
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Email Subscriptions</CardTitle>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleUnsubscribe}
                        disabled={selectedIds.length === 0 || isUnsubscribing}
                    >
                        {isUnsubscribing ? "Unsubscribing..." : `Unsubscribe (${selectedIds.length})`}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {subscriptions.map((subscription) => (
                        <div
                            key={subscription.id}
                            className={cn(
                                "flex items-center space-x-4 rounded-lg border p-4",
                                subscription.status === "unsubscribed" && "opacity-50"
                            )}
                        >
                            <Checkbox
                                id={subscription.id}
                                checked={selectedIds.includes(subscription.id)}
                                onCheckedChange={() => toggleSubscription(subscription.id)}
                                disabled={subscription.status === "unsubscribed"}
                            />
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">{subscription.sender}</p>
                                <p className="text-sm text-muted-foreground">
                                    {subscription.sender}@{subscription.domain}
                                </p>
                            </div>
                            <Badge>{subscription.type}</Badge>
                            <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                                {subscription.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
