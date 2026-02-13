import { PROMO_CODE } from "@/config/site";

export function ImportantNotice({
  promoCode = PROMO_CODE,
  text = "L'acces complet a la methode s'active uniquement avec ce code promo :"
}: {
  promoCode?: string;
  text?: string;
}) {
  return (
    <section
      aria-label="Important"
      className="relative overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 min-[380px]:p-5 shadow-soft sm:p-6"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg animate-bounce-slow">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="min-w-0 flex-1">
          <h2 className="text-base min-[380px]:text-lg font-bold tracking-tight text-amber-900 dark:text-amber-100 mb-2 !normal-case !font-sans">
            ⚠️ Important
          </h2>
          <p className="text-sm min-[380px]:text-base leading-relaxed text-amber-800 dark:text-amber-200">
            {text}
          </p>
          
          {/* Promo code display */}
          <div className="mt-4 inline-flex items-center gap-2 flex-wrap">
            <span className="px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border-2 border-amber-500/50 text-base min-[380px]:text-xl font-bold tracking-[0.08em] min-[380px]:tracking-[0.15em] text-amber-700 dark:text-amber-300 shadow-md">
              {promoCode}
            </span>
            <span className="badge-warning rounded-full px-3 py-1.5 text-xs font-semibold">
              Obligatoire
            </span>
          </div>
          
          <p className="mt-3 text-sm text-amber-700/80 dark:text-amber-300/80">
            🔒 Sans ce code, l&apos;activation de la methode reste incomplete.
          </p>
        </div>
      </div>
    </section>
  );
}
