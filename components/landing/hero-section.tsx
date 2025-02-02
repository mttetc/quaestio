"use client";

import { Button } from "@/components/ui/button";
import { Mail, Brain, LineChart, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    const scrollToFeatures = () => {
        const featuresSection = document.querySelector("#features");
        featuresSection?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="container mx-auto flex flex-col items-center justify-center gap-4 pb-8 pt-24 md:pt-28 min-h-[100dvh]">
            <div className="mt-8 md:mt-0 flex max-w-[980px] flex-col items-center gap-8 text-center">
                <h1 className="text-4xl font-medium leading-tight tracking-tight md:text-6xl lg:leading-[1.2] max-w-3xl">
                    Save Questions and Answers from Your{" "}
                    <span className="inline-block bg-gradient-to-r from-primary/90 via-secondary/90 to-accent/90 bg-clip-text text-transparent font-semibold">
                        Email
                    </span>
                </h1>
                <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                    Find and save Q&As from your emails. Search your past answers and track common questions.
                </p>
            </div>

            <div className="flex gap-4 mt-4">
                <Link href="/signup">
                    <Button size="lg">Get Started</Button>
                </Link>
                <Button variant="outline" size="lg" onClick={scrollToFeatures}>
                    Learn More
                </Button>
            </div>

            <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
