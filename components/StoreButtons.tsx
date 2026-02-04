import type { ReactNode } from "react";

function ButtonShell({
  href,
  ariaLabel,
  children
}: {
  href: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-semibold text-zinc-50 shadow-soft outline-none transition hover:bg-black/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 sm:w-auto"
    >
      {children}
    </a>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-zinc-50">
      <path
        fill="currentColor"
        d="M16.55 13.23c.03 3.08 2.71 4.1 2.74 4.11-.02.07-.43 1.5-1.43 2.97-.86 1.27-1.76 2.54-3.17 2.57-1.38.03-1.83-.82-3.41-.82s-2.08.79-3.38.85c-1.36.06-2.39-1.36-3.26-2.62C.62 17.92-1.08 10.86 2 7.42c.97-1.07 2.16-1.7 3.46-1.72 1.36-.03 2.65.92 3.41.92.76 0 2.2-1.14 3.71-.97.63.03 2.4.25 3.54 1.9-.09.06-2.11 1.23-2.08 3.68ZM14.1 3.7c.72-.87 1.2-2.08 1.07-3.3-1.03.04-2.28.69-3.02 1.56-.66.76-1.24 1.98-1.09 3.14 1.15.09 2.32-.59 3.04-1.4Z"
      />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-zinc-50">
      <path
        fill="currentColor"
        d="M3.6 2.1c-.35.22-.6.65-.6 1.2v17.4c0 .55.25.98.6 1.2l10.3-9.9L3.6 2.1Zm12.2 8.8 2.3-2.2-2.6-1.5-1.7 1.6 2 2.1Zm-2 2.1 1.7 1.6 2.6-1.5-2.3-2.2-2 2.1Zm.9 2.9 2.8 2.7c.3.3.6.4.9.4.2 0 .5-.06.7-.2.35-.22.6-.65.6-1.2v-2.7l-5 3Zm0-8.8 5 3V6.4c0-.55-.25-.98-.6-1.2-.22-.14-.45-.2-.7-.2-.33 0-.63.12-.9.4l-2.8 2.7Z"
      />
    </svg>
  );
}

export function StoreButtons({ appStoreUrl, playStoreUrl }: { appStoreUrl: string; playStoreUrl: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ButtonShell href={appStoreUrl} ariaLabel="Ouvrir sur l’App Store (lien externe)">
        <AppleIcon />
        <div className="leading-tight">
          <div className="text-[11px] font-medium text-zinc-300">Télécharger sur</div>
          <div className="text-sm font-semibold">App Store</div>
        </div>
      </ButtonShell>
      <ButtonShell href={playStoreUrl} ariaLabel="Ouvrir sur Google Play (lien externe)">
        <GooglePlayIcon />
        <div className="leading-tight">
          <div className="text-[11px] font-medium text-zinc-300">Télécharger sur</div>
          <div className="text-sm font-semibold">Google Play</div>
        </div>
      </ButtonShell>
    </div>
  );
}
