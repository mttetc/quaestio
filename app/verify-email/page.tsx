"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { checkEmailVerification, resendVerificationEmail } from "@/lib/core/auth/verification";
import { useFormStatus } from "react-dom";

function ResendButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="w-full"
    >
      {pending ? "Sending..." : "Resend verification email"}
    </Button>
  );
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function verify() {
      try {
        const result = await checkEmailVerification();
        if (result.shouldRedirect) {
          router.push(result.shouldRedirect);
        }
      } catch (error) {
        console.error('Verification check failed:', error);
      }
    }

    verify();
  }, [router]);

  async function handleResend() {
    try {
      await resendVerificationEmail();
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
    }
  }

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

        <form action={handleResend}>
          <ResendButton />
        </form>
      </div>
    </div>
  );
}