import { useMutation } from "@tanstack/react-query";
import { exportData } from "../api";
import { useToast } from "@/components/ui/use-toast";

export function useExport() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: exportData,
        onSuccess: async ({ data: blob, extension }) => {
            try {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `export-${new Date().toISOString()}.${extension}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                toast({
                    title: "Export Complete",
                    description: "Your data has been exported successfully.",
                });
            } catch (error) {
                toast({
                    title: "Download Failed",
                    description: "Failed to download the exported file.",
                    variant: "destructive",
                });
            }
        },
        onError: (error: Error) => {
            toast({
                title: "Export Failed",
                description: error.message || "Failed to export data.",
                variant: "destructive",
            });
        },
    });
}
