import { Inter } from "next/font/google";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Quaestio - Email Q&A Extraction",
    description: "Transform your email conversations into structured Q&A format automatically.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
