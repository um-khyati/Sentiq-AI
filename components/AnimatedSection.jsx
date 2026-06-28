"use client";

import { motion } from "framer-motion";

/**
 * AnimatedSection
 * Wraps content with a fade-up reveal animation that triggers once
 * when the section scrolls into view. Used to keep scroll animations
 * consistent and performant across the app (animate only once).
 */
export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  as = "div",
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}
