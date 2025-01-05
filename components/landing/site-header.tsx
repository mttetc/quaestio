import Link from "next/link";
import { Mail } from "lucide-react";

export function SiteHeader() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b card-gradient fixed w-full z-[100] bg-black/50 backdrop-blur-sm">
            <Link className="flex items-center justify-center" href="/">
                <div className="p-2 rounded-xl bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <span className="ml-2 text-2xl font-bold text-gradient">Quaestio</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link
                    className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-white"
                    href="/login"
                >
                    Sign In
                </Link>
            </nav>
        </header>
    );
}
