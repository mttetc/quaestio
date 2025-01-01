'use client';

import { useMutation } from "@tanstack/react-query";
import { exportData } from "../api";
import { useToast } from "@/components/ui/use-toast";

export function useExport() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: exportData,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Your data export has been initiated. You will receive an email when it's ready.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to export data. Please try again.",
                variant: "destructive",
            });
        },
    });
} 