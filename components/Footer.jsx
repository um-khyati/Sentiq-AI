import Link from "next/link";
import { Github, Linkedin, Sparkles, Mail } from "lucide-react";

// Footer link columns. Internal routes match the assignment's required pages;
// external/placeholder links use "#" since no backend pages exist yet.
const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "About", href: "/about" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About SentiqAI", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-surface-dark">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-card">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Sentiq<span className="text-gradient">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              AI-powered guest review intelligence for hospitality teams.
              Understand sentiment, spot trends, and act on feedback faster.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@sentiqai.app"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row dark:border-slate-800">
          <p>&copy; {new Date().getFullYear()} SentiqAI. All rights reserved.</p>
          <p>Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
