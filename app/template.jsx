"use client";

import { motion } from "framer-motion";

/**
 * Route template (Next.js App Router).
 * Re-renders on every navigation, giving each page a consistent
 * fade + slight upward entrance animation without affecting layout.
 */
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
