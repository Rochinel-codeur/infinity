"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = localStorage.getItem("theme");
    const initialDark = stored ? stored === "dark" : prefersDark;
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="group relative w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-soft transition-all duration-300 hover:shadow-md hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:outline-none overflow-hidden"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {/* Sun icon */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isDark ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
        }`}
      >
        <svg
          className="w-5 h-5 text-amber-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {/* Moon icon */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
        }`}
      >
        <svg
          className="w-5 h-5 text-indigo-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </span>

      {/* Hover glow effect */}
      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-amber-200/20 to-transparent dark:from-indigo-400/20" />
    </button>
  );
}
