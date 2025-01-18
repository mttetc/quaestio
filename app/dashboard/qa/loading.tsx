import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function QALoading() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Q&A Management</h2>
                    <p className="text-muted-foreground">Manage your question and answer pairs</p>
                </div>
                <Skeleton className="h-10 w-[120px]" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-[300px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                                <Skeleton className="h-8 w-[100px]" />
                            </div>
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
