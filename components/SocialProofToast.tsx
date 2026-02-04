"use client";

import { useEffect, useState } from "react";

const NOTIFICATIONS = [
  { name: "Sébastien L.", action: "a copié le code", time: "à l'instant" },
  { name: "Marc K.", action: "vient de s'inscrire", time: "il y a 2 min" },
  { name: "Julie M.", action: "a téléchargé l'app", time: "il y a 5 min" },
  { name: "Thomas B.", action: "a copié le code", time: "il y a 8 min" },
  { name: "Karim D.", action: "a appliqué la méthode", time: "il y a 12 min" },
];

export function SocialProofToast() {
  const [current, setCurrent] = useState<typeof NOTIFICATIONS[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start showing notifications after 3 seconds
    const startTimeout = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    const showRandomNotification = () => {
      const randomNotif = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
      setCurrent(randomNotif);
      setIsVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      // Show next notification after random interval (8-15 seconds)
      const nextInterval = Math.floor(Math.random() * 7000) + 8000;
      setTimeout(showRandomNotification, nextInterval);
    };

    return () => clearTimeout(startTimeout);
  }, []);

  if (!current) return null;

  return (
    <div 
      className={`fixed bottom-24 left-4 sm:bottom-6 sm:left-6 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 p-3 rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-default">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {current.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {current.name}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {current.action} <span className="text-emerald-500">• {current.time}</span>
          </p>
        </div>
        <div className="ml-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </div>
  );
}
