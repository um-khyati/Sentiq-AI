"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Smile, AlertTriangle, MessageCircle, BrainCircuit } from "lucide-react";

const cards = [
  {
    title: "Positive Reviews",
    description:
      "Identify what guests love most about their stay, from friendly staff to spotless rooms, so you can amplify it.",
    icon: Smile,
    accent:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    title: "Negative Reviews",
    description:
      "Quickly surface recurring complaints and pain points so your team can act before they affect your reputation.",
    icon: AlertTriangle,
    accent:
      "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  },
  {
    title: "Neutral Reviews",
    description:
      "Understand mixed feedback and uncover hidden opportunities for improvement that aren't clearly positive or negative.",
    icon: MessageCircle,
    accent:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    title: "AI Insights",
    description:
      "Get AI-generated summaries and trends across all your reviews to make faster, data-driven decisions.",
    icon: BrainCircuit,
    accent:
      "bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <Hero />

        {/* Feature cards section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              Everything you need to understand your guests
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              SentiqAI breaks down every review into clear, actionable
              categories so your team always knows where to focus.
            </p>
          </AnimatedSection>

          {/* Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
              <AnimatedSection key={card.title} delay={idx * 0.1}>
                <Card
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  accent={card.accent}
                />
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
