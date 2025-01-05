"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);
    if (!mounted) return <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-md" />;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative h-9 w-9 rounded-md overflow-hidden"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </motion.div>
            </AnimatePresence>
        </Button>
    );
}
