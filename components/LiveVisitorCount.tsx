"use client";

import { useState, useEffect } from "react";

export function LiveVisitorCount() {
  const [count, setCount] = useState(243);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(180, Math.min(350, prev + change));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-green-900/20 border border-green-500/30 mb-3 sm:mb-4 backdrop-blur-md transition-all hover:bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 text-green-500"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-lg shadow-green-500"></span>
      </span>
      <span className="text-[11px] min-[380px]:text-xs sm:text-sm font-bold text-green-400 tracking-wide">
        {count} personnes analysent cette méthode
      </span>
    </div>
  );
}
