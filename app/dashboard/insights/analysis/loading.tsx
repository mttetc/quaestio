import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AnalysisLoading() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Content Analysis</h2>
                <p className="text-muted-foreground">Analyze and compare Q&A content</p>
            </div>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <Skeleton className="h-5 w-[150px]" />
                                <Skeleton className="h-[200px] w-full" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-5 w-[150px]" />
                                <Skeleton className="h-[200px] w-full" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Skeleton className="h-10 w-[120px]" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </Card>
            </div>
        </div>
    );
}
