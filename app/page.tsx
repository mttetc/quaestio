"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Brain, Zap, Database, ChevronDown } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b card-gradient fixed w-full z-50">
        <Link className="flex items-center justify-center" href="/">
          <div className="p-2 rounded-xl bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <span className="ml-2 text-2xl font-bold text-gradient">Quaestio</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link 
            className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors" 
            href="/login"
          >
            Sign In
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient opacity-10 blur-3xl"></div>
          <div className="relative w-full py-24 md:py-32 lg:py-40">
            <motion.div 
              className="container px-4 md:px-6"
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              <motion.div 
                className="flex flex-col items-center space-y-8 text-center"
                variants={fadeIn}
              >
                <motion.div 
                  className="space-y-4 max-w-3xl mx-auto"
                  variants={fadeIn}
                >
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Transform Your <span className="text-gradient">Email Conversations</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                    Automatically extract and organize Q&A from your email threads. Save time and never lose important information again.
                  </p>
                </motion.div>
                <motion.div 
                  className="space-x-4"
                  variants={fadeIn}
                >
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300"
                  >
                    <Link href="/signup" className="group">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.section 
          className="w-full py-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-accent/5"></div>
          <div className="container px-4 md:px-6 relative">
            <motion.div 
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div 
                className="group card-gradient p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="p-4 rounded-2xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mt-4 mb-2">Smart Extraction</h2>
                <p className="text-muted-foreground">
                  Advanced AI algorithms identify and extract Q&A patterns from your emails
                </p>
              </motion.div>
              <motion.div 
                className="group card-gradient p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="p-4 rounded-2xl bg-secondary/10 w-fit group-hover:bg-secondary/20 transition-colors">
                  <Zap className="h-8 w-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold mt-4 mb-2">Instant Processing</h2>
                <p className="text-muted-foreground">
                  Real-time email processing and Q&A generation
                </p>
              </motion.div>
              <motion.div 
                className="group card-gradient p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="p-4 rounded-2xl bg-accent/10 w-fit group-hover:bg-accent/20 transition-colors">
                  <Database className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mt-4 mb-2">Organized Storage</h2>
                <p className="text-muted-foreground">
                  All your Q&As stored and categorized for easy access
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="w-full border-t card-gradient">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-gradient font-semibold">Quaestio</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Quaestio. All rights reserved.
            </p>
            <nav className="flex gap-6">
              <Link className="text-sm hover:text-primary transition-colors" href="#">
                Terms
              </Link>
              <Link className="text-sm hover:text-primary transition-colors" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}