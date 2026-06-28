/** @type {import('tailwindcss').Config} */
module.exports = {
  // Class-based dark mode so we can toggle via JS + localStorage
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette for SentiqAI
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1", // Indigo accent
          600: "#4f46e5",
          700: "#4338ca",
        },
        accent: {
          400: "#60a5fa",
          500: "#3b82f6", // Blue accent
          600: "#2563eb",
        },
        // Deep slate/near-black surface for dark mode
        surface: {
          DEFAULT: "#ffffff",
          dark: "#05070f",
          darkCard: "#0d1220",
        },
      },
      boxShadow: {
        card: "0 4px 20px rgba(79, 70, 229, 0.08)",
        cardHover: "0 14px 40px rgba(79, 70, 229, 0.18)",
        glow: "0 0 25px rgba(99, 102, 241, 0.45)",
        glowSoft: "0 0 45px rgba(99, 102, 241, 0.15)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.05) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(15px) scale(1.05)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        floatSlow: "floatSlow 12s ease-in-out infinite",
        gradientX: "gradientX 8s ease infinite",
        pulseGlow: "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
