"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/shared/utils";
import { Mail } from "lucide-react";
import { mainNavItems } from "@/components/dashboard/nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="w-64 h-screen bg-black/10 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col"
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mb-8 group">
        <motion.div
          whileHover={{ rotate: 20 }}
          whileTap={{ scale: 0.9 }}
        >
          <Mail className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors" />
        </motion.div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
          Quaestio
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-6">
        {mainNavItems.map((group) => (
          <div key={group.name}>
            <motion.button
              onClick={() => setActiveGroup(activeGroup === group.link ? null : group.link)}
              className="w-full flex items-center gap-2 text-neutral-400 hover:text-white transition-all"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={activeGroup === group.link ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                {group.icon}
              </motion.div>
              <span className="font-medium">{group.name}</span>
            </motion.button>

            {/* Sub-items */}
            <AnimatePresence>
              {group.subItems && activeGroup === group.link && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 ml-6 space-y-1"
                >
                  {group.subItems.map((item) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      className={cn(
                        "group flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-all",
                        pathname === item.link
                          ? "bg-primary/10 text-primary"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {item.icon}
                      </motion.div>
                      <div>
                        <div className="font-medium group-hover:text-primary/80 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </motion.div>
  );
}
