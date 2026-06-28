"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

/**
 * StatCard
 * Dashboard statistic card that fades in on load and animates its
 * numeric value counting up from 0 once it enters the viewport.
 *
 * Props:
 * - label: stat name (e.g. "Total Reviews")
 * - value: numeric target value
 * - icon: lucide-react icon component
 * - accent: Tailwind classes for the icon badge
 * - delay: stagger delay for entrance animation
 */
import {
  ClipboardList,
  Smile,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
const iconMap = {
  ClipboardList,
  Smile,
  AlertTriangle,
  MessageCircle,
};
export default function StatCard({ label, value, icon, accent, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [displayValue, setDisplayValue] = useState(0);
  const Icon = iconMap[icon];
  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 1.2,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-cardHover dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none dark:hover:shadow-glowSoft"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${accent}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
        {displayValue.toLocaleString()}
      </p>
    </motion.div>
  );
}
