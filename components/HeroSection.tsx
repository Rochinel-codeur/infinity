"use client";

import { useEffect, useState } from "react";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  appliedCount: number;
}

export function HeroSection({ title, subtitle, appliedCount }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative pt-20 pb-16 sm:pt-32 sm:pb-24 overflow-visible">
      
      {/* Dynamic blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
        <div className="blob bg-emerald-400/20 w-96 h-96 rounded-full top-0 left-0 mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob-bounce" />
        <div className="blob bg-teal-300/20 w-96 h-96 rounded-full bottom-0 right-0 mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob-bounce" style={{ animationDelay: "2s" }} />
      </div>

      <div className={`relative z-10 text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        
        {/* New Pill Badge */}
        <div className="inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 mb-8 hover:scale-105 transition-transform cursor-default shadow-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-emerald-500/30">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-wide">
            Approuvée par la communauté
          </span>
        </div>

        {/* Cinematic Title */}
        <h1 className="hero-title mb-8 max-w-4xl mx-auto">
          <span className="gradient-text-premium block mb-2">Méthode simple,</span>
          <span className="relative inline-block">
            <span className="gradient-text-emerald relative z-10 text-glow-emerald">Résultats prouvés.</span>
            <svg className="absolute -bottom-2 w-full h-3 text-emerald-400/30 -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
            </svg>
          </span>
        </h1>

        {/* Refined Subtitle */}
        <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          {subtitle}
        </p>

        {/* Premium Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="premium-card px-6 py-3 flex items-center gap-4 bg-white/80 dark:bg-zinc-800/80">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-700 overflow-hidden relative z-[${5-i}]`}>
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*132}`} 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-800 bg-emerald-500 flex items-center justify-center text-white text-xs font-bold relative z-0">
                +99
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">
                  <AnimatedCounter end={appliedCount} />
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Utilisateurs actifs</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
