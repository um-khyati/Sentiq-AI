"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button, Input, useToast } from "@/components/ui";
import { authApi, authStorage } from "@/lib/api";
import { Mail, Lock, User, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password });
      authStorage.save(res.data);
      toast("Account created! Redirecting to your dashboard…", { variant: "success" });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-surface-dark">
        <AnimatedSection className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card transition-colors duration-300 sm:p-10 dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none">
            <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Start understanding your guest reviews with SentiqAI.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="mt-8 space-y-5">
              <Input
                label="Full name"
                icon={User}
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                helperText="At least 8 characters."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />

              <Button type="submit" variant="primary" fullWidth loading={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Log in
              </Link>
            </p>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </>
  );
}
