import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Target, Zap, ShieldCheck } from "lucide-react";

const highlights = [
  {
    title: "Our Mission",
    description: "Help hotels and restaurants turn feedback into growth.",
    icon: Target,
  },
  {
    title: "Fast & Simple",
    description:
      "A clean dashboard that surfaces what matters most, instantly.",
    icon: Zap,
  },
  {
    title: "Built to Scale",
    description:
      "Designed with a clean architecture ready for future AI features.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          {/* Page heading */}
          <AnimatedSection>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              About SentiqAI
            </h1>

            {/* Description */}
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              SentiqAI is an AI-powered review intelligence platform designed to
              help hospitality businesses understand guest feedback through
              sentiment analysis and actionable insights.
            </p>
          </AnimatedSection>

          {/* Simple supporting feature highlights */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {highlights.map((item, idx) => (
              <AnimatedSection key={item.title} delay={idx * 0.1}>
                <div className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none dark:hover:shadow-glowSoft">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-transform duration-300 group-hover:scale-110 dark:bg-primary-500/15 dark:text-primary-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
