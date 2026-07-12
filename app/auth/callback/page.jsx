"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader } from "@/components/ui";
import { authApi, authStorage } from "@/lib/api";
import { AlertCircle } from "lucide-react";

/**
 * /auth/callback
 *
 * Landing page for the Google OAuth flow. The backend
 * (GET /api/auth/google/callback) redirects here as:
 *
 *   /auth/callback?token=<jwt>
 *
 * We store that token, use it to fetch the user's profile from
 * GET /api/auth/me, save both, and forward to /dashboard — exactly
 * like a normal email/password login, just arriving via a different door.
 */
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError("Google sign-in was cancelled or failed. Please try again.");
      return;
    }

    if (!token) {
      setError("No authentication token was returned. Please try signing in again.");
      return;
    }

    (async () => {
      try {
        // Stash the token first so the authenticated request below can use it.
        window.localStorage.setItem("sentiqai_token", token);
        const res = await authApi.me();
        authStorage.save({ token, user: res.data.user });
        router.replace("/dashboard");
      } catch (err) {
        authStorage.clear();
        setError("We couldn't verify your Google sign-in. Please try again.");
      }
    })();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
        <a href="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
      <Loader />
      <p className="text-sm text-slate-500 dark:text-slate-400">Finishing sign-in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1">
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center py-24">
              <Loader />
            </div>
          }
        >
          <CallbackHandler />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
