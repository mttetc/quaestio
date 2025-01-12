"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "@/lib/features/auth/actions/signIn";
import { useRouter } from "next/navigation";

const DEV_ADMIN_EMAIL = "admin@example.com";
const DEV_ADMIN_PASSWORD = "admin123";

export function DevLogin() {
    const router = useRouter();
    const { toast } = useToast();

    // Only show in development
    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    const handleDevLogin = async () => {
        try {
            const formData = new FormData();
            formData.append("email", DEV_ADMIN_EMAIL);
            formData.append("password", DEV_ADMIN_PASSWORD);

            await signIn(null, formData);
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to login",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="mt-4 text-center">
            <Button
                variant="outline"
                onClick={handleDevLogin}
                className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
            >
                Dev Login (Admin)
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">Only visible in development mode</p>
        </div>
    );
}
