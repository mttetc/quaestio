"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface Item {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const HoverEffect = ({ items }: { items: Item[] }) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-r from-neutral-800 via-neutral-800/90 to-neutral-900 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.icon}</CardTitle>
            <CardDescription>
              <span className="font-bold text-lg text-neutral-200 mb-2 block">
                {item.title}
              </span>
              <span className="text-neutral-400 text-sm block">
                {item.description}
              </span>
            </CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-6 overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900/80 border border-neutral-800 group-hover:border-neutral-700 relative z-10 transition duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};

const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("font-bold tracking-wide mb-4", className)}>
      {children}
    </div>
  );
};

const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
};