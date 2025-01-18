import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your Q&A system</p>
                </div>
                <Skeleton className="h-10 w-[250px]" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-6">
                        <Skeleton className="h-4 w-[100px] mb-4" />
                        <Skeleton className="h-8 w-[120px] mb-4" />
                        <Skeleton className="h-2 w-full mb-2" />
                        <Skeleton className="h-4 w-[140px]" />
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-[150px]" />
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-[150px]" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </Card>
            </div>
        </div>
    );
}
