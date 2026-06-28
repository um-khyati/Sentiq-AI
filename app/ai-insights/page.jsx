"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button, Input, Loader, useToast } from "@/components/ui";
import { reviewsApi } from "@/lib/api";
import { BrainCircuit, Smile, Frown, Meh, Save, CheckCircle2 } from "lucide-react";

/**
 * /ai-insights — AI Feature Screen.
 *
 * Lets the user paste a guest review and "analyze" it using a
 * deterministic keyword classifier (kept client-side — no real AI model
 * is required for this assignment). Once analyzed, the result can be
 * saved to the backend as a new Review via POST /api/reviews, which is
 * the "create" operation this page contributes to Deliverable 3.
 */
export default function AiInsightsPage() {
  const { toast } = useToast();
  const [guest, setGuest] = useState("");
  const [room, setRoom] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast("Please paste a review to analyze.", { variant: "warning" });
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setSaved(false);

    // Mock async "AI" call — deterministic keyword classifier for demo purposes.
    setTimeout(() => {
      const classification = mockClassify(reviewText);
      setResult(classification);
      setAnalyzing(false);
      toast("Analysis complete.", { variant: "success" });
    }, 1500);
  };

  /** Persists the analyzed review to the backend (POST /api/reviews). */
  const handleSaveToReviews = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await reviewsApi.create({
        guest: guest.trim() || "Anonymous Guest",
        room: room.trim() || "Unspecified",
        sentiment: result.sentiment,
        score: result.confidence,
        text: reviewText,
        date: new Date().toISOString().slice(0, 10),
      });
      setSaved(true);
      toast("Saved to Reviews.", { variant: "success" });
    } catch (err) {
      toast(err.message, { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50 transition-colors duration-300 dark:bg-surface-dark">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              AI Sentiment Analysis
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              Paste any guest review below and let SentiqAI classify its sentiment
              instantly. Save the result straight to your Reviews list.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="mt-10">
            <form
              onSubmit={handleAnalyze}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none sm:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Guest name (optional)"
                  placeholder="Anonymous Guest"
                  value={guest}
                  onChange={(e) => setGuest(e.target.value)}
                />
                <Input
                  label="Room (optional)"
                  placeholder="Unspecified"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>

              <Input
                label="Guest review"
                placeholder="e.g. The staff were wonderful and the room was spotless…"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="mt-4"
              />

              <Button type="submit" className="mt-5" loading={analyzing} fullWidth>
                {analyzing ? "Analyzing…" : "Analyze Sentiment"}
              </Button>
            </form>

            {analyzing && (
              <div className="mt-6 flex justify-center">
                <Loader variant="dots" label="Running AI analysis…" />
              </div>
            )}

            {result && !analyzing && (
              <ResultCard
                result={result}
                onSave={handleSaveToReviews}
                saving={saving}
                saved={saved}
              />
            )}
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </>
  );
}

function ResultCard({ result, onSave, saving, saved }) {
  const meta = {
    Positive: { icon: Smile, classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
    Negative: { icon: Frown, classes: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400" },
    Neutral: { icon: Meh, classes: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  }[result.sentiment];
  const Icon = meta.icon;

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none sm:p-8">
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${meta.classes}`}>
          <Icon className="h-4 w-4" />
          {result.sentiment}
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Confidence: {result.confidence}%
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{result.summary}</p>

      <Button
        type="button"
        variant="secondary"
        className="mt-5"
        onClick={onSave}
        loading={saving}
        disabled={saved}
        fullWidth
      >
        {saved ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Saved to Reviews
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save to Reviews
          </>
        )}
      </Button>
    </div>
  );
}

/** Lightweight keyword-based mock classifier for demo purposes. */
function mockClassify(text) {
  const lower = text.toLowerCase();
  const positiveWords = ["great", "love", "amazing", "wonderful", "clean", "friendly", "best", "spotless", "attentive"];
  const negativeWords = ["bad", "broken", "dirty", "rude", "noisy", "slow", "worst", "disappointing", "terrible"];

  const score =
    positiveWords.filter((w) => lower.includes(w)).length -
    negativeWords.filter((w) => lower.includes(w)).length;

  if (score > 0) {
    return {
      sentiment: "Positive",
      confidence: Math.min(95, 70 + score * 6),
      summary: "This review highlights positive aspects of the guest experience.",
    };
  }
  if (score < 0) {
    return {
      sentiment: "Negative",
      confidence: Math.min(95, 70 + Math.abs(score) * 6),
      summary: "This review points to issues that may need attention from staff.",
    };
  }
  return {
    sentiment: "Neutral",
    confidence: 60,
    summary: "This review is mixed or doesn't strongly lean positive or negative.",
  };
}
