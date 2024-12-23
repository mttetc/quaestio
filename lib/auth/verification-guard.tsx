"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/providers/supabase-provider";
import { isEmailVerified } from "./verification";

export function VerificationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session } = useSupabase();

  useEffect(() => {
    async function checkVerification() {
      if (!session?.user) return;

      const verified = await isEmailVerified(session.user);
      if (!verified) {
        router.push("/verify-email");
      }
    }

    checkVerification();
  }, [session, router]);

  return <>{children}</>;
}