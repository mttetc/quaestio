"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { useSupabase } from "@/lib/providers/supabase-provider";
import { isEmailVerified, sendVerificationEmail } from "@/lib/auth/verification";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { session } = useSupabase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkVerification() {
      if (!session?.user) {
        router.push("/login");
        return;
      }

      const verified = await isEmailVerified(session.user);
      if (verified) {
        router.push("/dashboard");
      }
    }

    checkVerification();
  }, [session, router]);

  const handleResendEmail = async () => {
    if (!session?.user?.email) return;
    
    setIsLoading(true);
    try {
      await sendVerificationEmail(session.user.email);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground">
          We sent you a verification email. Please check your inbox and click the
          verification link to continue.
        </p>

        <Button
          onClick={handleResendEmail}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? "Sending..." : "Resend verification email"}
        </Button>
      </div>
    </div>
  );
}