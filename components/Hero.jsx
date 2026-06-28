"use client";

import { motion } from "framer-motion";
import Button from "@/components/Button";
import {
  ArrowRight,
  PlayCircle,
  TrendingUp,
  MessageSquareText,
  Sparkles,
  Smile,
} from "lucide-react";

// Stagger animation for the hero text/CTA stack
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// Sentiment breakdown shown inside the AI insight panel visual
const sentimentBars = [
  { label: "Positive", value: 64, color: "bg-emerald-500" },
  { label: "Neutral", value: 22, color: "bg-amber-400" },
  { label: "Negative", value: 14, color: "bg-rose-500" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-grid">
      {/* Animated glowing background blobs */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-primary-400/30 blur-3xl dark:bg-primary-500/20"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-96 w-96 rounded-full bg-accent-400/20 blur-3xl dark:bg-accent-500/10"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28 lg:px-8">
        {/* Left column: copy + CTAs */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          {/* Eyebrow tag */}
          <motion.span
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Guest Review Intelligence
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white"
          >
            Turn Guest Reviews into{" "}
            <span className="text-gradient">Actionable Insights</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-base text-slate-600 sm:text-lg lg:mx-0 dark:text-slate-400"
          >
            SentiqAI uses AI-powered sentiment analysis to help hospitality
            businesses understand customer feedback and improve guest
            satisfaction.
          </motion.p>

          {/* Call to action buttons */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start"
          >
            <Button href="/dashboard" variant="primary">
              Analyze Reviews
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/about" variant="secondary">
              <PlayCircle className="h-4 w-4" />
              See How It Works
            </Button>
          </motion.div>

          {/* Trust strip */}
          <motion.p
            variants={item}
            className="mt-8 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            Built for hotels · resorts · restaurants · vacation rentals
          </motion.p>
        </motion.div>

        {/* Right column: AI insight panel visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* Glow behind the panel */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary-400/30 to-accent-400/20 blur-2xl dark:from-primary-500/20 dark:to-accent-500/10" />

          {/* Main glass panel */}
          <div className="glass relative rounded-3xl border border-white/40 p-6 shadow-cardHover dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Sentiment Overview
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last 30 days · 1,284 reviews
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>

            {/* Animated sentiment bars */}
            <div className="mt-6 space-y-4">
              {sentimentBars.map((bar, idx) => (
                <div key={bar.label}>
                  <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                    <span>{bar.label}</span>
                    <span>{bar.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      className={`h-full rounded-full ${bar.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 1, delay: 0.4 + idx * 0.15, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI summary callout */}
            <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50/60 p-4 dark:border-primary-500/20 dark:bg-primary-500/5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300">
                  <MessageSquareText className="h-3.5 w-3.5" />
                </span>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  &ldquo;Guests consistently praise check-in speed and room
                  cleanliness. Late-night noise is the top recurring
                  complaint.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Floating badge: AI score */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -left-6 -top-6 hidden items-center gap-2 rounded-2xl border border-white/40 px-4 py-3 shadow-card sm:flex dark:border-white/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <Smile className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                92% Satisfaction
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                AI confidence: high
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
