import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function SettingsLoading() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-[200px]" />
                            <Skeleton className="h-4 w-[300px]" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-[200px]" />
                            <Skeleton className="h-4 w-[300px]" />
                        </div>
                        <div className="grid gap-4">
                            <Skeleton className="h-[120px] w-full" />
                            <Skeleton className="h-10 w-[200px]" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
