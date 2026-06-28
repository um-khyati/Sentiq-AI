"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2 } from "lucide-react";

/**
 * @typedef {Object} ButtonProps
 * @property {string} [href] - If provided, renders as a Next.js <Link> instead of a <button>.
 * @property {React.ReactNode} children - Button label/content.
 * @property {"primary"|"secondary"|"ghost"|"danger"} [variant="primary"] - Visual style.
 * @property {"sm"|"md"|"lg"} [size="md"] - Button size.
 * @property {boolean} [loading=false] - Shows a spinner and disables interaction.
 * @property {boolean} [disabled=false] - Disables the button.
 * @property {boolean} [fullWidth=false] - Stretches the button to 100% width.
 * @property {"button"|"submit"|"reset"} [type="button"] - Native button type (ignored when `href` is set).
 * @property {string} [className] - Extra classes merged onto the root element.
 */

/**
 * Button — shared CTA / action button used across SentiqAI.
 *
 * Renders a Next.js <Link> when `href` is supplied, otherwise a native
 * <button>. Includes spring-driven hover/tap micro-interactions and a
 * loading state with an inline spinner.
 *
 * @param {ButtonProps} props
 */
export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const variants = {
    primary:
      "bg-primary-600 text-white shadow-card hover:bg-primary-500 hover:shadow-glow dark:bg-primary-500 dark:hover:bg-primary-400",
    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-400",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400",
    danger:
      "bg-rose-600 text-white shadow-card hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400",
  };

  const isDisabled = disabled || loading;

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  const motionProps = {
    whileHover: isDisabled ? {} : { scale: 1.04 },
    whileTap: isDisabled ? {} : { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </>
  );

  if (href && !isDisabled) {
    return (
      <motion.div {...motionProps} className={fullWidth ? "block" : "inline-block"}>
        <Link href={href} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={classes}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
}
