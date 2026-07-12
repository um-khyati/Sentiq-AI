"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import StatCard from "@/components/StatCard";
import { Button, Loader } from "@/components/ui";
import { reviewsApi } from "@/lib/api";
import RouteGuard from "@/components/RouteGuard";
import {
  BarChart3,
  LayoutDashboard,
  MessageSquareText,
  BrainCircuit,
  Settings,
  Menu,
  X,
  Smile,
  Frown,
  Meh,
  AlertCircle,
} from "lucide-react";

// Sidebar navigation — collapses into a top bar / drawer on mobile
const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, active: true },
  { href: "/reviews", label: "Reviews", icon: MessageSquareText },
  { href: "/ai-insights", label: "AI Insights", icon: BrainCircuit },
  { href: "/about", label: "Settings", icon: Settings },
];

const sentimentMeta = {
  Positive: { icon: Smile, classes: "text-emerald-600 dark:text-emerald-400" },
  Negative: { icon: Frown, classes: "text-rose-600 dark:text-rose-400" },
  Neutral: { icon: Meh, classes: "text-amber-600 dark:text-amber-400" },
};

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch aggregated counts and the review list in parallel.
      const [statsRes, reviewsRes] = await Promise.all([
        reviewsApi.stats(),
        reviewsApi.getAll(),
      ]);
      setStats(statsRes.data);
      setRecentReviews((reviewsRes.data || []).slice(0, 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Shape backend stats into the StatCard array the UI already expects.
  const statCards = stats
    ? [
        {
          label: "Total Reviews",
          value: stats.total,
          icon: "ClipboardList",
          accent: "bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400",
        },
        {
          label: "Positive",
          value: stats.positive,
          icon: "Smile",
          accent: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
        },
        {
          label: "Negative",
          value: stats.negative,
          icon: "AlertTriangle",
          accent: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
        },
        {
          label: "Neutral",
          value: stats.neutral,
          icon: "MessageCircle",
          accent: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        },
      ]
    : [];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50 transition-colors duration-300 dark:bg-surface-dark">
        {/*
          Responsive shell:
          - Mobile (<768px):  sidebar hidden by default, opens as a slide-over drawer
          - Tablet (>=768px): sidebar becomes a fixed icon+label column via CSS Grid
          - Desktop (>=1280px): wider sidebar column, content gets a max-width cap
        */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-[200px_1fr] md:gap-8 lg:grid-cols-[240px_1fr] lg:px-8 lg:py-12">
          {/* Mobile top bar (sidebar trigger) */}
          <div className="flex items-center justify-between md:hidden">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open dashboard menu"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar — desktop/tablet: static column. Mobile: slide-over drawer */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-5 shadow-xl transition-transform duration-300 dark:bg-surface-darkCard md:static md:z-auto md:w-auto md:translate-x-0 md:rounded-2xl md:border md:border-slate-200 md:p-4 md:shadow-card md:dark:border-slate-800 md:dark:shadow-none ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="mb-6 flex items-center justify-between md:hidden">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Menu</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      link.active
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Backdrop for mobile drawer */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
              aria-hidden="true"
            />
          )}

          {/* Main content column */}
          <div className="min-w-0">
            <AnimatedSection className="hidden md:block">
              <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl dark:text-white">
                Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                Overview of guest review sentiment analytics.
              </p>
            </AnimatedSection>

            {loading ? (
              <div className="mt-10 flex justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-surface-darkCard">
                <Loader label="Loading dashboard…" />
              </div>
            ) : error ? (
              <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 py-16 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
                <AlertCircle className="h-6 w-6 text-rose-500" />
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{error}</p>
                <Button variant="secondary" size="sm" onClick={loadDashboardData}>
                  Try again
                </Button>
              </div>
            ) : (
              <>
                {/* Stat cards — 1 col mobile, 2 col tablet, 4 col desktop */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-4 lg:gap-6">
                  {statCards.map((stat, idx) => (
                    <StatCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      icon={stat.icon}
                      accent={stat.accent}
                      delay={idx * 0.1}
                    />
                  ))}
                </div>

                {/* Two-column area on large screens: trend placeholder + recent reviews */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
                  <AnimatedSection delay={0.15}>
                    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-700 dark:bg-surface-darkCard dark:shadow-none">
                      <BarChart3 className="h-6 w-6 text-primary-500" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Sentiment trend charts will appear here in a future version.
                      </p>
                    </div>
                  </AnimatedSection>

                  <AnimatedSection delay={0.2}>
                    <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none">
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                          Recent Reviews
                        </h2>
                        <Link href="/reviews" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
                          View all
                        </Link>
                      </div>
                      {recentReviews.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No reviews yet.
                        </p>
                      ) : (
                        <ul className="flex flex-col gap-3">
                          {recentReviews.map((r) => {
                            const meta = sentimentMeta[r.sentiment];
                            const Icon = meta.icon;
                            return (
                              <li key={r._id} className="flex items-center justify-between text-sm">
                                <span className="text-slate-700 dark:text-slate-300">{r.guest}</span>
                                <span className={`flex items-center gap-1.5 font-medium ${meta.classes}`}>
                                  <Icon className="h-3.5 w-3.5" />
                                  {r.sentiment}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <Button href="/ai-insights" variant="secondary" size="sm" fullWidth className="mt-5">
                        Analyze a new review
                      </Button>
                    </div>
                  </AnimatedSection>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// This page is only reachable when logged in — RouteGuard checks the
// JWT (via GET /api/auth/me) and redirects to /login otherwise.
export default function DashboardPage() {
  return (
    <RouteGuard>
      <DashboardContent />
    </RouteGuard>
  );
}
