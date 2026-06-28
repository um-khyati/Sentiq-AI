"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Whether the modal is visible.
 * @property {() => void} onClose - Called when the user dismisses the modal
 *   (backdrop click, Escape key, or close button).
 * @property {string} [title] - Heading rendered in the modal header.
 * @property {React.ReactNode} children - Modal body content.
 * @property {React.ReactNode} [footer] - Optional footer, typically action buttons.
 * @property {"sm"|"md"|"lg"} [size="md"] - Controls the max width of the modal.
 */

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

/**
 * Modal — accessible, animated dialog used for confirmations, detail
 * views, and forms. Renders into a portal at document.body and locks
 * background scroll while open.
 *
 * @param {ModalProps} props
 */
export default function Modal({ isOpen, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/70"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className={`relative w-full ${sizes[size]} rounded-2xl border border-slate-200 bg-white p-6 shadow-cardHover dark:border-slate-800 dark:bg-surface-darkCard`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              {title && (
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="ml-auto rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>

            {footer && (
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
