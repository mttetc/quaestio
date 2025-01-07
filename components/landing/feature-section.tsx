"use client";

import {
    Mail,
    Brain,
    LineChart,
    Zap,
    Search,
    Tags,
    Timer,
    TrendingUp,
    MessageSquare,
    Unlink,
    FolderKanban,
    Workflow,
} from "lucide-react";

const features = [
    {
        title: "Email Q&A Extraction",
        description: "Find and save questions and answers from your email conversations.",
        icon: Mail,
        features: ["Question detection", "Answer matching", "Accuracy scoring", "Batch processing"],
    },
    {
        title: "Search & Organization",
        description: "Save email Q&As in a searchable database.",
        icon: Brain,
        features: ["Topic grouping", "Auto-tagging", "Search", "Export options"],
    },
    {
        title: "Reports & Data",
        description: "See how your email Q&As are used and distributed.",
        icon: LineChart,
        features: ["Response tracking", "Message analysis", "Topic groups", "Pattern detection"],
    },
    {
        title: "Email Tools",
        description: "Manage your emails more efficiently.",
        icon: Zap,
        features: ["Newsletter handling", "Unsubscribe tools", "Task handling", "Email sorting"],
    },
];

export function FeatureSection() {
    return (
        <section className="relative min-h-[100dvh]">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

            <div className="container relative mx-auto space-y-16 py-24 sm:py-32" id="features">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold sm:text-4xl">Everything You Need to Master Your Email</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Powerful features to help you extract value, gain insights, and take control of your email
                        communications.
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="relative overflow-hidden rounded-lg border bg-background p-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{feature.title}</h3>
                            </div>
                            <p className="mt-4 text-muted-foreground">{feature.description}</p>
                            <ul className="mt-6 grid gap-3">
                                {feature.features.map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm">
                                        <div className="rounded-full border bg-background p-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
