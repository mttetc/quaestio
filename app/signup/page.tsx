import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Mail } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6" />
          <span className="text-2xl font-bold">Quaestio</span>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to get started
          </p>
        </div>
        <AuthForm type="signup" />
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}