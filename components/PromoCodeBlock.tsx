"use client";

import { useState, useEffect } from "react";

interface PromoCodeBlockProps {
  code: string;
  enableTracking: boolean;
  sectionId?: string;
}

export function PromoCodeBlock({ code, enableTracking, sectionId }: PromoCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [canCopy, setCanCopy] = useState(true);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    if (!canCopy) return;
    
    try {
      if (enableTracking) {
        navigator.sendBeacon("/api/track", JSON.stringify({ event: "copy_code_click", code }));
      }
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCanCopy(false);
      setTimeout(() => setCanCopy(true), 1000);
    } catch (err) {
      // Fallback
      setCopied(true);
    }
  };

  return (
    <div id={sectionId} className="w-full max-w-2xl mx-auto px-4">
      <div className="relative group perspective-1000">
        
        {/* Glow Effect behind */}
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-500" />
        
        <div className="relative premium-card p-8 sm:p-10 border border-emerald-500/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-2xl animate-pulse">🎁</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Code Promo Exclusif</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Offre à durée limitée</p>
              </div>
            </div>
            <div className="hidden sm:block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
              Vérifié Actif
            </div>
          </div>

          {/* Code Display Area */}
          <div 
            onClick={handleCopy}
            className="group/code relative cursor-pointer bg-zinc-50 dark:bg-black/50 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <code className="text-3xl sm:text-5xl font-mono font-bold tracking-widest text-zinc-800 dark:text-zinc-100 mx-auto sm:mx-0">
                {code}
              </code>
              
              <button 
                className={`hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  copied 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105" 
                    : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105"
                }`}
              >
                {copied ? "Copié !" : "Copier"}
                {!copied && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
            
            <p className="mt-4 text-center sm:text-left text-sm text-zinc-500">
              Clique pour copier automatiquement le code
            </p>
            
            {/* Success Confetti Effect (CSS only simple implementation) */}
            {copied && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                 <span className="animate-scale-in text-6xl opacity-20">✨</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20">
            <span className="text-xl">💡</span>
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-snug">
              <strong>Important :</strong> Colle ce code lors de ton inscription pour débloquer les avantages. Sans ce code, la méthode ne fonctionnera pas.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
