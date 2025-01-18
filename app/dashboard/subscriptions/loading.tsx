import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function SubscriptionsLoading() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
                <p className="text-muted-foreground">Manage your email subscriptions</p>
            </div>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-[200px]" />
                                <Skeleton className="h-4 w-[300px]" />
                            </div>
                            <Skeleton className="h-10 w-[120px]" />
                        </div>
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <Skeleton className="h-8 w-[300px]" />
                                    <Skeleton className="h-8 w-[100px]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
