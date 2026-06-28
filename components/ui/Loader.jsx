"use client";

import { motion } from "framer-motion";

/**
 * @typedef {Object} LoaderProps
 * @property {"sm"|"md"|"lg"} [size="md"] - Spinner diameter.
 * @property {"spinner"|"dots"} [variant="spinner"] - Visual style.
 * @property {string} [label] - Optional text rendered next to/under the loader.
 * @property {boolean} [fullScreen=false] - Centers the loader in a full-viewport overlay.
 * @property {string} [className] - Extra classes merged onto the wrapper.
 */

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

const dotSizeMap = {
  sm: "h-1.5 w-1.5",
  md: "h-2.5 w-2.5",
  lg: "h-3.5 w-3.5",
};

/**
 * Loader — spinner / dots loading indicator used for async states
 * (AI sentiment analysis, data fetches, form submissions).
 *
 * @param {LoaderProps} props
 */
export default function Loader({
  size = "md",
  variant = "spinner",
  label,
  fullScreen = false,
  className = "",
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status">
      {variant === "spinner" ? (
        <span
          className={`inline-block animate-spin rounded-full border-primary-200 border-t-primary-600 dark:border-slate-700 dark:border-t-primary-400 ${sizeMap[size]}`}
        />
      ) : (
        <span className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={`rounded-full bg-primary-600 dark:bg-primary-400 ${dotSizeMap[size]}`}
              animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </span>
      )}
      {label && (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      )}
      <span className="sr-only">Loading…</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-surface-dark/70">
        {content}
      </div>
    );
  }

  return content;
}
