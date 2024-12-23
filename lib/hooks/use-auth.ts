"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface AuthCredentials {
  email: string;
  password: string;
}

async function signUp({ email, password }: AuthCredentials) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return true;
}

async function signIn({ email, password }: AuthCredentials) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return true;
}

export function useAuth(type: "login" | "signup") {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: type === "signup" ? signUp : signIn,
    onSuccess: () => {
      if (type === "signup") {
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}