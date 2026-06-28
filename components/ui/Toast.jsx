"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * @typedef {"success"|"error"|"info"|"warning"} ToastVariant
 * @typedef {Object} ToastItem
 * @property {string} id
 * @property {string} message
 * @property {ToastVariant} variant
 * @property {number} duration
 */

const ToastContext = createContext(/** @type {{toast: (msg: string, opts?: {variant?: ToastVariant, duration?: number}) => void}} */ ({
  toast: () => {},
}));

const variantStyles = {
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  error: {
    icon: XCircle,
    classes: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
  },
  info: {
    icon: Info,
    classes: "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-400",
  },
};

/**
 * ToastProvider — wrap the app (see app/layout.jsx) to enable the
 * `useToast()` hook anywhere in the component tree.
 *
 * @param {{children: React.ReactNode}} props
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState(/** @type {ToastItem[]} */ ([]));

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, { variant = "info", duration = 4000 } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
            <AnimatePresence>
              {toasts.map((t) => {
                const { icon: Icon, classes } = variantStyles[t.variant] || variantStyles.info;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: -16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    role="status"
                    className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-card backdrop-blur-md ${classes}`}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="flex-1 text-sm font-medium">{t.message}</p>
                    <button
                      type="button"
                      onClick={() => dismiss(t.id)}
                      aria-label="Dismiss notification"
                      className="text-current opacity-60 transition-opacity hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

/**
 * useToast — returns `{ toast }`. Call `toast("message", { variant, duration })`
 * from any client component nested under <ToastProvider>.
 *
 * @returns {{toast: (message: string, options?: {variant?: ToastVariant, duration?: number}) => void}}
 */
export function useToast() {
  return useContext(ToastContext);
}
