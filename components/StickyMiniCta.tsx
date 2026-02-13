"use client";

import { useEffect, useState } from "react";

export function StickyMiniCta({
  href,
  label,
  action
}: {
  href: string;
  label: string;
  action: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      const shouldShow = window.scrollY > 300;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
    >
      <div className="sticky-cta safe-area-inset-bottom">
        <div className="mx-auto max-w-[1120px] px-3 min-[430px]:px-4 py-2.5 sm:py-3 sm:px-6">
          <div className="flex flex-col min-[430px]:flex-row items-stretch min-[430px]:items-center justify-between gap-2.5 min-[430px]:gap-4">
            {/* Code display */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shadow-md shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs min-[380px]:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {label}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden min-[430px]:block">
                  Copiez le code avant de vous inscrire sur 1xbet
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={href}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 min-[380px]:px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
            >
              <span>{action}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M12 4v16" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
