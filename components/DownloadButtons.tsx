import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import type { ReactNode } from "react";

function ButtonShell({
  href,
  ariaLabel,
  children,
  variant = "default"
}: {
  href: string;
  ariaLabel: string;
  children: ReactNode;
  variant?: "default" | "apple" | "google";
}) {
  const baseStyles = `
    group relative inline-flex w-full items-center justify-center gap-3 
    rounded-2xl px-5 py-4 text-left font-semibold
    shadow-soft outline-none transition-all duration-300
    hover:shadow-soft-lg hover:-translate-y-1
    focus-visible:ring-2 focus-visible:ring-emerald-500/50
    sm:w-auto overflow-hidden
  `;

  const variantStyles = {
    default: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
    apple: "bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 text-white dark:text-zinc-900",
    google: "bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700"
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
      <div className="relative flex items-center gap-3">
        {children}
      </div>
    </a>
  );
}

function AppleIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-md">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-white dark:text-zinc-900">
        <path
          fill="currentColor"
          d="M16.55 13.23c.03 3.08 2.71 4.1 2.74 4.11-.02.07-.43 1.5-1.43 2.97-.86 1.27-1.76 2.54-3.17 2.57-1.38.03-1.83-.82-3.41-.82s-2.08.79-3.38.85c-1.36.06-2.39-1.36-3.26-2.62C.62 17.92-1.08 10.86 2 7.42c.97-1.07 2.16-1.7 3.46-1.72 1.36-.03 2.65.92 3.41.92.76 0 2.2-1.14 3.71-.97.63.03 2.4.25 3.54 1.9-.09.06-2.11 1.23-2.08 3.68ZM14.1 3.7c.72-.87 1.2-2.08 1.07-3.3-1.03.04-2.28.69-3.02 1.56-.66.76-1.24 1.98-1.09 3.14 1.15.09 2.32-.59 3.04-1.4Z"
        />
      </svg>
    </div>
  );
}

function GooglePlayIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 flex items-center justify-center shadow-md">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-white">
        <path
          fill="currentColor"
          d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.609-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zM5.864 2.658L16.8 9.991l-2.302 2.302-8.634-8.635zm15.028 7.241a1 1 0 0 1 0 1.722l-3.082 1.783-2.532-2.532 2.532-2.532 3.082 1.559z"
        />
      </svg>
    </div>
  );
}

export function DownloadButtons({
  playStoreUrl = PLAY_STORE_URL,
  appStoreUrl = APP_STORE_URL,
  microcopy = "Télécharge l'application officielle avant de t'inscrire"
}: {
  playStoreUrl?: string;
  appStoreUrl?: string;
  microcopy?: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
        {microcopy}
      </p>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <ButtonShell href={appStoreUrl} ariaLabel="Ouvrir sur l'App Store (lien externe)" variant="apple">
          <AppleIcon />
          <div className="text-left">
            <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Télécharger sur
            </div>
            <div className="text-base font-bold text-white dark:text-zinc-900">
              App Store
            </div>
          </div>
        </ButtonShell>
        
        <ButtonShell href={playStoreUrl} ariaLabel="Ouvrir sur Google Play (lien externe)" variant="google">
          <GooglePlayIcon />
          <div className="text-left">
            <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
              Disponible sur
            </div>
            <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Google Play
            </div>
          </div>
        </ButtonShell>
      </div>
    </div>
  );
}
