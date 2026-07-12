"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, authStorage } from "@/lib/api";
import { Loader } from "@/components/ui";

/**
 * RouteGuard
 *
 * Wrap any page that should only be reachable by logged-in users:
 *
 *   <RouteGuard>
 *     <DashboardContent />
 *   </RouteGuard>
 *
 * Behavior:
 *  - No token in localStorage at all -> redirect to /login immediately.
 *  - Token present -> verified against the backend (GET /api/auth/me).
 *    If the backend rejects it (expired/invalid/user deleted), the stale
 *    token is cleared and the user is redirected to /login too.
 *  - While the check is in flight, a loader is shown instead of the
 *    protected content so nothing sensitive flashes on screen first.
 */
export default function RouteGuard({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // "checking" | "authed"

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const token = authStorage.getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        await authApi.me(); // throws if the token is missing/expired/invalid
        if (!cancelled) setStatus("authed");
      } catch (err) {
        authStorage.clear();
        if (!cancelled) router.replace("/login");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status !== "authed") {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader />
      </div>
    );
  }

  return children;
}
