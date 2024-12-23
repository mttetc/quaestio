"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth/client";

export function useAuthForm(type: "login" | "signup") {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (type === "login") {
        const { error, data } = await signInWithEmail(email, password);
        if (error) throw error;
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;

        toast({
          title: "Success",
          description: "Account created successfully. You can now sign in.",
        });
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, onSubmit };
}