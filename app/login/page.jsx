"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import { useToast } from "@/components/ui";
import { authApi, authStorage } from "@/lib/api";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      authStorage.save(res.data);
      toast(`Welcome back, ${res.data.user.name}!`, { variant: "success" });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-surface-dark">
        <AnimatedSection className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card transition-colors duration-300 sm:p-10 dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none">
            {/* Page heading */}
            <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
              Login
            </h1>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Welcome back! Please sign in to continue.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login form, now wired to POST /api/auth/login */}
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-primary-500/20"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-primary-500/20"
                  />
                </div>
              </div>

              {/* Remember me / forgot password row */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  Remember me
                </label>
                <span className="cursor-pointer font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Forgot password?
                </span>
              </div>

              {/* Sign In button */}
              <Button type="submit" variant="primary" className="w-full" loading={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            {/* Sign up prompt */}
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
  href="/signup"
  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
>
  Sign up
</Link>
            </p>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </>
  );
}
