"use client";

import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * ErrorBoundary (Week 8 — edge case handling)
 *
 * Catches unexpected render/runtime errors anywhere in its child tree
 * (a malformed API response, a null field the UI didn't expect, a
 * third-party library throwing, etc.) and shows a friendly fallback
 * screen instead of the blank white page React would otherwise leave
 * behind.
 *
 * Mounted once in app/layout.jsx so it covers every route. Note this
 * only catches errors thrown during rendering / lifecycle methods —
 * it does NOT catch errors inside async code (e.g. a rejected fetch
 * inside a useEffect). Those are already handled per-page with
 * try/catch + the `error` state + Toasts (see dashboard, reviews,
 * ai-insights). The two mechanisms are complementary, not overlapping.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Swap this for a real error-tracking service (Sentry, LogRocket, …)
    // before shipping to production.
    console.error("SentiqAI render error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
          SentiqAI hit an unexpected error rendering this page. It's been
          logged — try again, or head back to the dashboard.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={this.handleReset}>
            Try again
          </Button>
          <Button href="/dashboard">Go to Dashboard</Button>
        </div>
      </div>
    );
  }
}
