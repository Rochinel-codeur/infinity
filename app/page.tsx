import { PromoCodeBlock } from "@/components/PromoCodeBlock";
import { DownloadButtons } from "@/components/DownloadButtons";
import { TestimonialsAboveFold } from "@/components/TestimonialsAboveFold";
import { HowToVideo } from "@/components/HowToVideo";
import { ImportantNotice } from "@/components/ImportantNotice";
import { FinalCta } from "@/components/FinalCta";
import { StickyMiniCta } from "@/components/StickyMiniCta";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TrustBadges } from "@/components/TrustBadges";
import { HeroSection } from "@/components/HeroSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SocialProofToast } from "@/components/SocialProofToast";
import { PROMO_CODE } from "@/config/site";
import { testimonials } from "@/data/testimonials";

const VIDEO_SRC = process.env.NEXT_PUBLIC_VIDEO_SRC ?? "/media/demo.mp4";
const VIDEO_POSTER = process.env.NEXT_PUBLIC_VIDEO_POSTER ?? "/assets/poster.jpg";
const APPLIED_COUNT = parseInt(process.env.NEXT_PUBLIC_APPLIED_COUNT ?? "12000", 10);
const ENABLE_COPY_TRACKING = (process.env.NEXT_PUBLIC_ENABLE_COPY_TRACKING ?? "") === "1";

export default function Page() {
  return (
    <div className="min-h-screen hero-pattern">
      {/* Mesh Background */}
      <div className="mesh-bg" />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
        <div className="mx-auto max-w-[1120px] px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Méthode Testée</span>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Vérifiée</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Admin Link with visible text */}
            <a 
              href="/admin" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              title="Administration"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-32 sm:px-6 sm:pb-24">
        {/* HERO SECTION */}
        <HeroSection 
          title="Méthode simple et déjà testée : tu es au bon endroit."
          subtitle="Tu as vu la méthode dans la vidéo Facebook… voici ce que les gens en disent avant de se lancer."
          appliedCount={APPLIED_COUNT}
        />

        {/* Trust Badges */}
        <ScrollReveal delay={200}>
          <div className="my-8">
            <TrustBadges />
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <ScrollReveal delay={100}>
          <section className="space-y-6" aria-label="Section preuve sociale">
            <TestimonialsAboveFold
              title=""
              facebookHint=""
              appliedCount={APPLIED_COUNT}
              testimonials={testimonials}
              hideHeader={true}
            />
          </section>
        </ScrollReveal>
        
        {/* Promo Code - MAIN CTA */}
        <ScrollReveal delay={150}>
          <div className="mt-10">
            <PromoCodeBlock 
              sectionId="promo-code" 
              code={PROMO_CODE} 
              enableTracking={ENABLE_COPY_TRACKING} 
            />
          </div>
        </ScrollReveal>

        {/* Download + Video */}
        <ScrollReveal delay={100}>
          <section
            aria-label="Téléchargement et inscription"
            id="download"
            className="mt-12 grid gap-6 lg:grid-cols-2"
          >
            {/* Video Card */}
            <div className="order-1">
              <HowToVideo
                videoSrc={VIDEO_SRC}
                poster={VIDEO_POSTER}
                hint="Suis exactement ces étapes dans la vidéo : tu verras où cliquer et à quel moment coller le code pendant l'inscription."
              />
            </div>

            {/* Download Card */}
            <div className="premium-card p-6 order-2">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Télécharge l'application
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      Étape 1
                    </span>
                    <span className="text-sm text-zinc-500">sur 2</span>
                  </div>
                </div>
              </div>
              
              <DownloadButtons />
              
              {/* Features */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: "⚡", title: "Ultra rapide", desc: "Chargement instantané" },
                  { icon: "✓", title: "Simple", desc: "Parcours guidé" },
                ].map((feature) => (
                  <div key={feature.title} className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-100 dark:border-zinc-700 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{feature.icon}</span>
                      <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{feature.title}</p>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Important Notice + Final CTA */}
        <ScrollReveal delay={100}>
          <section aria-label="Rappel important et action" className="mt-12 space-y-6">
            <ImportantNotice promoCode={PROMO_CODE} />
            <FinalCta promoCode={PROMO_CODE} />
          </section>
        </ScrollReveal>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">Méthode Testée</p>
                <p className="text-xs text-zinc-500">© {new Date().getFullYear()} — Tous droits réservés</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Confidentialité</a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Conditions</a>
            </div>
          </div>
          
          {/* Legal disclaimer */}
          <div className="mt-6 p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800 backdrop-blur-sm">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <strong className="text-zinc-600 dark:text-zinc-300">⚠️ Avertissement légal :</strong> Réservé aux personnes majeures (18+). 
              Les jeux d'argent comportent des risques (endettement, dépendance). En cas de difficulté, faites-vous aider.
            </p>
            <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Apple of Fortune est un jeu de hasard. Cette méthode ne garantit aucun gain. Résultats variables.
              Site non affilié officiellement à 1xBet.
            </p>
          </div>
        </footer>
      </main>

      {/* Sticky Mini CTA */}
      <StickyMiniCta href="#promo-code" label={`Code promo : ${PROMO_CODE}`} action="Voir" />
      
      {/* Social Proof Toast Notifications */}
      <SocialProofToast />
    </div>
  );
}
