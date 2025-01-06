"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function SiteHeader() {
    const [lastScrollY, setLastScrollY] = useState(0);
    const [shouldShow, setShouldShow] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setShouldShow(false);
            } else {
                setShouldShow(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <motion.header
            className="px-4 lg:px-6 h-16 flex items-center border-b fixed w-full z-[100] bg-background/80 backdrop-blur-sm"
            initial={{ y: 0, opacity: 1 }}
            animate={{
                y: shouldShow ? 0 : "-100%",
                opacity: shouldShow ? 1 : 0,
            }}
            transition={{
                duration: 0.2,
                ease: "easeInOut",
                opacity: { duration: 0.15 },
            }}
        >
            <Link className="flex items-center justify-center" href="/">
                <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="ml-2 text-xl font-medium tracking-tight bg-gradient-to-r from-primary/90 via-secondary/90 to-accent/90 bg-clip-text text-transparent">
                    Quaestio
                </span>
            </Link>
            <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                <ThemeSwitcher />
                <Link
                    className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-foreground hover:text-foreground"
                    href="/login"
                >
                    Sign In
                </Link>
            </nav>
        </motion.header>
    );
}
