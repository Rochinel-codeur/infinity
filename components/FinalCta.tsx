import { APP_STORE_URL, PLAY_STORE_URL, PROMO_CODE, SIGNUP_URL } from "@/config/site";

export function FinalCta({
  promoCode = PROMO_CODE,
  signupUrl = SIGNUP_URL,
  downloadHref = "#download",
  title = "Prêt à faire comme les autres ?"
}: {
  promoCode?: string;
  signupUrl?: string;
  downloadHref?: string;
  title?: string;
}) {
  return (
    <section
      aria-label="Appel à l'action"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-600 p-6 sm:p-8 shadow-glow-lg"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
            <span className="text-white/90 text-sm font-medium">🎯 Dernière étape</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            {title}
          </h2>
          
          <p className="text-base sm:text-lg text-white/90 max-w-md mx-auto">
            Télécharge l'application, puis utilise le code promo{" "}
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{promoCode}</span>{" "}
            à l'inscription.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 max-w-lg mx-auto">
          <a
            href={downloadHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-bold text-blue-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger l'app
          </a>
          
          <a
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`S'inscrire avec le code ${promoCode} (lien externe)`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            S'inscrire maintenant
          </a>
        </div>

        {/* Alternative links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/70 mb-2">Liens directs vers les stores :</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.55 13.23c.03 3.08 2.71 4.1 2.74 4.11-.02.07-.43 1.5-1.43 2.97-.86 1.27-1.76 2.54-3.17 2.57-1.38.03-1.83-.82-3.41-.82s-2.08.79-3.38.85c-1.36.06-2.39-1.36-3.26-2.62C.62 17.92-1.08 10.86 2 7.42c.97-1.07 2.16-1.7 3.46-1.72 1.36-.03 2.65.92 3.41.92.76 0 2.2-1.14 3.71-.97.63.03 2.4.25 3.54 1.9-.09.06-2.11 1.23-2.08 3.68ZM14.1 3.7c.72-.87 1.2-2.08 1.07-3.3-1.03.04-2.28.69-3.02 1.56-.66.76-1.24 1.98-1.09 3.14 1.15.09 2.32-.59 3.04-1.4Z"/>
              </svg>
              App Store
            </a>
            <span className="text-white/40">•</span>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.609-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zM5.864 2.658L16.8 9.991l-2.302 2.302-8.634-8.635zm15.028 7.241a1 1 0 0 1 0 1.722l-3.082 1.783-2.532-2.532 2.532-2.532 3.082 1.559z"/>
              </svg>
              Play Store
            </a>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Sécurisé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Inscription rapide</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
            </svg>
            <span>+12 000 utilisateurs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
