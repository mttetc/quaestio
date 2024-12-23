import Link from 'next/link';
import { Mail } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <span className="text-gradient font-semibold">Quaestio</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 Quaestio. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link className="text-sm hover:text-primary transition-colors text-gray-400" href="#">
              Terms
            </Link>
            <Link className="text-sm hover:text-primary transition-colors text-gray-400" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}