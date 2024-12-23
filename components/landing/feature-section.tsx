"use client";

import { Search, BookOpen, BarChart2, XCircle } from 'lucide-react';
import { HoverEffect } from '@/components/ui/aceternity/card-hover-effect';

const features = [
  {
    title: "Smart Extraction",
    description: "AI-powered extraction of Q&As from your email conversations. Our advanced algorithms identify and extract meaningful question-answer pairs automatically.",
    icon: <Search className="h-6 w-6 text-neutral-500 group-hover:text-white/80" />,
  },
  {
    title: "Knowledge Base",
    description: "Transform your email Q&As into structured documentation. Generate beautiful FAQs and knowledge bases with just a few clicks.",
    icon: <BookOpen className="h-6 w-6 text-neutral-500 group-hover:text-white/80" />,
  },
  {
    title: "Deep Insights",
    description: "Analyze patterns and sentiment in your email communications. Get actionable insights to improve your response quality and efficiency.",
    icon: <BarChart2 className="h-6 w-6 text-neutral-500 group-hover:text-white/80" />,
  },
  {
    title: "Subscription Manager",
    description: "Take control of your inbox. Easily identify and unsubscribe from unwanted email subscriptions with our intelligent management tools.",
    icon: <XCircle className="h-6 w-6 text-neutral-500 group-hover:text-white/80" />,
  },
];

export function FeatureSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gray-950">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            Powerful Features
          </h2>
          <p className="mt-4 text-neutral-400">
            Everything you need to manage and leverage your email communications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HoverEffect items={features} />
        </div>
      </div>
    </section>
  );
}