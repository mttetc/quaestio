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
  Workflow
} from "lucide-react";

const features = [
  {
    title: "Smart Q&A Extraction",
    description: "Automatically identify and extract meaningful questions and answers from your email conversations.",
    icon: Mail,
    features: [
      "AI-powered Q&A detection",
      "Context-aware extraction",
      "Confidence scoring",
      "Bulk processing capabilities"
    ]
  },
  {
    title: "Knowledge Organization",
    description: "Turn your email Q&As into a searchable knowledge base with intelligent organization.",
    icon: Brain,
    features: [
      "AI-powered categorization",
      "Automatic tagging",
      "Smart search capabilities",
      "Knowledge base export"
    ]
  },
  {
    title: "Analytics & Insights",
    description: "Gain valuable insights into your email communications and Q&A patterns.",
    icon: LineChart,
    features: [
      "Response time tracking",
      "Sentiment analysis",
      "Topic clustering",
      "Trend identification"
    ]
  },
  {
    title: "Email Automation",
    description: "Streamline your email workflow with intelligent automation features.",
    icon: Zap,
    features: [
      "Newsletter management",
      "Bulk unsubscribe",
      "Task automation",
      "Smart categorization"
    ]
  }
];

export function FeatureSection() {
  return (
    <section className="container space-y-16 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Everything You Need to Master Your Email
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Powerful features to help you extract value, gain insights, and take control of your email communications.
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
            <p className="mt-4 text-muted-foreground">
              {feature.description}
            </p>
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
    </section>
  );
}