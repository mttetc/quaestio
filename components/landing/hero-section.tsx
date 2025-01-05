"use client";

import { Button } from "@/components/ui/button";
import { Mail, Brain, LineChart, Zap } from "lucide-react";

export function HeroSection() {
    const scrollToFeatures = () => {
        const featuresSection = document.querySelector("#features");
        featuresSection?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="container mx-auto flex flex-col items-center justify-center gap-4 pb-8 pt-24 md:pt-28 min-h-[calc(100vh-4rem)]">
            <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                    Transform Your Email into
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        {" "}
                        Actionable Knowledge
                    </span>
                </h1>
                <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                    Automatically extract Q&As, generate insights, and manage your email communications intelligently.
                    Your email inbox, reimagined with AI.
                </p>
            </div>

            <div className="flex gap-4">
                <Button size="lg">Get Started</Button>
                <Button variant="outline" size="lg" onClick={scrollToFeatures}>
                    Learn More
                </Button>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <FeatureCard
                    icon={Mail}
                    title="Smart Q&A Extraction"
                    description="Automatically identify and extract valuable Q&As from your email conversations"
                />
                <FeatureCard
                    icon={Brain}
                    title="Knowledge Management"
                    description="Organize, categorize, and search your Q&A library with AI-powered tagging"
                />
                <FeatureCard
                    icon={LineChart}
                    title="Analytics & Insights"
                    description="Track response times, analyze sentiment patterns, and identify trends"
                />
                <FeatureCard
                    icon={Zap}
                    title="Email Automation"
                    description="Manage subscriptions, automate responses, and streamline communications"
                />
            </div>
        </section>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-lg bg-primary/10 p-2">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
