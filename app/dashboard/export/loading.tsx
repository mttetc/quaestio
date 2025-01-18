import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ExportLoading() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Export Q&A</h2>
                <p className="text-muted-foreground">Export your Q&A pairs in different formats</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-[150px]" />
                                <Skeleton className="h-4 w-[250px]" />
                            </div>
                            <Skeleton className="h-10 w-[120px]" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
