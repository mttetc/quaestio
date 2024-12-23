import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { DevLogin } from "@/components/auth/dev-login";
import { Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6" />
          <span className="text-2xl font-bold">Quaestio</span>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <AuthForm type="login" />
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </p>
        <DevLogin />
      </div>
    </div>
  );
}