import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { ToastProvider } from "../components/ui";

// Metadata for the SentiqAI app (Next.js App Router convention)
export const metadata = {
  title: "SentiqAI – AI-Powered Guest Review Intelligence",
  description:
    "SentiqAI uses AI-powered sentiment analysis to help hospitality businesses understand customer feedback and improve guest satisfaction.",
};

// Inline script that runs before paint to avoid a light/dark flash:
// it applies the saved theme (or system preference) to <html> immediately.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('sentiqai-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased transition-colors duration-300 dark:bg-surface-dark dark:text-slate-100">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
