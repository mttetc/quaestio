import Link from "next/link";
import { Mail, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 border-r h-screen p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Mail className="h-6 w-6" />
        <span className="text-xl font-bold">Quaestio</span>
      </div>
      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent"
        >
          <Mail className="h-4 w-4" />
          <span>Q&A</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}