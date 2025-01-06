"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query";
import { ThemeProvider } from "./theme";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
    );
}
