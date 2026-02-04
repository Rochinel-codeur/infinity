"use client";

import { useEffect, useState } from "react";

interface TrustBadge {
  icon: string;
  label: string;
  value: string;
}

const badges: TrustBadge[] = [
  { icon: "✓", label: "Utilisateurs", value: "12 000+" },
  { icon: "⭐", label: "Note moyenne", value: "4.9/5" },
  { icon: "🔒", label: "100%", value: "Sécurisé" },
  { icon: "⚡", label: "Résultats en", value: "24h" },
];

export function TrustBadges() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {badges.map((badge, i) => (
          <div
            key={badge.label}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {badge.icon}
            </span>
            <div className="text-left">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{badge.label}</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{badge.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
