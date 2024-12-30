"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkEmailVerification } from "./verification";

export function VerificationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      try {
        const result = await checkEmailVerification();
        if (result.shouldRedirect === '/verify-email') {
          router.push('/verify-email');
        }
      } catch (error) {
        console.error('Verification check failed:', error);
      }
    }

    verify();
  }, [router]);

  return <>{children}</>;
}