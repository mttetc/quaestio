"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/shared/utils";
import { Check, Copy } from "lucide-react";

export const CodeBlock = ({
  code,
  language,
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={cn("relative group", className)}>
      <motion.div
        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={onCopy}
          className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </motion.div>
      <pre className="p-4 rounded-lg bg-neutral-900 overflow-x-auto">
        <code className={`language-${language || 'plaintext'} text-sm text-neutral-300`}>
          {code}
        </code>
      </pre>
    </div>
  );
};