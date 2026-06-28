"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

/**
 * ThemeProvider
 * - Defaults to the user's system preference on first load
 * - Persists the chosen theme in localStorage
 * - Applies/removes the `dark` class on <html> for Tailwind's class strategy
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // On mount, read the stored preference (or fall back to system preference)
  useEffect(() => {
    const stored = window.localStorage.getItem("sentiqai-theme");

    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    setMounted(true);
  }, []);

  // Keep <html> class and localStorage in sync with the current theme
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.localStorage.setItem("sentiqai-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
