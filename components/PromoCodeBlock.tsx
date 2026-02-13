"use client";

import { useState, useEffect } from "react";
import { emitLiveSync } from "@/lib/liveSync";

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

  const copyText = async (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let success = false;
    try {
      success = document.execCommand("copy");
    } catch {
      success = false;
    } finally {
      document.body.removeChild(textarea);
    }

    if (!success) {
      throw new Error("copy_failed");
    }
    return true;
  };

  const trackCopy = async () => {
    if (!enableTracking) return;
    const payload = JSON.stringify({ type: "code_copy", code });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
      }
    } catch {
      // ignore beacon errors
    }

    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
        cache: "no-store",
      });
    } catch {
      // ignore tracking errors
    }
  };

  const handleCopy = async () => {
    if (!canCopy) return;
    
    try {
      await copyText(code);
      trackCopy();
      emitLiveSync("analytics:code_copy");
      
      const { default: confetti } = await import("canvas-confetti");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#f59e0b']
      });

      setCopied(true);
      setCanCopy(false);
      setTimeout(() => setCanCopy(true), 1000);
    } catch (e: unknown) {
      console.error(e);
      setCopied(false);
    }
  };

  return (
    <div id={sectionId} className="w-full max-w-2xl mx-auto px-3 min-[430px]:px-4">
      <div className="relative group perspective-1000">
        
        {/* Glow Effect behind */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-500" />
        
        <div className="relative premium-card p-4 min-[380px]:p-6 sm:p-10 border border-blue-500/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
          
          {/* Header */}
          <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-2xl animate-pulse">🎁</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">Code promo officiel</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">A saisir pendant l&apos;inscription</p>
              </div>
            </div>
            <div className="hidden sm:block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              Actif et verifie
            </div>
          </div>

          {/* Code Display Area */}
          <div 
            onClick={handleCopy}
            className="group/code relative cursor-pointer bg-zinc-50 dark:bg-black/50 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-4 min-[380px]:p-5 sm:p-6 transition-colors duration-300"
          >
            <div className="flex flex-col min-[430px]:flex-row items-stretch min-[430px]:items-center justify-between gap-3 min-[430px]:gap-4">
              <code className="text-center min-[430px]:text-left text-2xl min-[380px]:text-3xl sm:text-5xl font-mono font-bold tracking-[0.08em] sm:tracking-widest text-zinc-800 dark:text-zinc-100 mx-auto min-[430px]:mx-0">
                {code}
              </code>
              
              <button 
                className={`inline-flex w-full min-[430px]:w-auto items-center justify-center gap-2 px-3 min-[380px]:px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs min-[380px]:text-sm font-bold transition-all duration-300 ${
                  copied 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105" 
                    : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105"
                }`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCopy();
                }}
              >
                {copied ? "Copie !" : "Copier"}
                {!copied && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
            
            <p className="mt-4 text-center sm:text-left text-xs min-[380px]:text-sm text-zinc-500">
              Copiez ce code maintenant puis collez-le pendant l&apos;inscription.
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
              <strong>Important :</strong> Ce code doit etre saisi pendant l&apos;inscription. Sans lui, vous n&apos;activez pas le bon parcours.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
