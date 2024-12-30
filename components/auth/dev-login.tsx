"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signInWithEmail } from "@/lib/core/auth/actions";
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
      const { error, data } = await signInWithEmail(DEV_ADMIN_EMAIL, DEV_ADMIN_PASSWORD);
      
      if (error) throw error;
      
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      }
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
      <p className="mt-2 text-xs text-muted-foreground">
        Only visible in development mode
      </p>
    </div>
  );
}