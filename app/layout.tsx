import { Inter, Outfit } from "next/font/google";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata = {
    title: "Quaestio - Email Q&A Extraction",
    description: "Transform your email conversations into structured Q&A format automatically.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${outfit.variable} ${inter.variable} font-sans`}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
