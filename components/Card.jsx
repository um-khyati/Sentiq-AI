"use client";

import { motion } from "framer-motion";

/**
 * Reusable Card component.
 *
 * Props:
 * - title: string heading shown on the card
 * - description: short supporting text
 * - icon: a lucide-react icon component
 * - accent: Tailwind classes for the icon badge (bg + text color)
 */
export default function Card({ title, description, icon: Icon, accent }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative rounded-2xl bg-gradient-to-br from-primary-500/30 via-transparent to-accent-500/30 p-px shadow-card transition-shadow duration-300 hover:shadow-cardHover dark:shadow-none dark:hover:shadow-glowSoft"
    >
      {/* Inner glass surface keeps the gradient visible only as a border */}
      <div className="glass relative h-full rounded-2xl p-6">
        {/* Icon badge */}
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
            accent || "bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400"
          }`}
        >
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
