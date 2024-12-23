"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex flex-col gap-4", className)}
    >
      {navItems.map((item, idx) => (
        <a
          key={item.link}
          href={item.link}
          className="flex items-center gap-2 text-neutral-300 hover:text-neutral-100 transition-colors"
        >
          {item.icon && <div className="w-4 h-4">{item.icon}</div>}
          <span>{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};