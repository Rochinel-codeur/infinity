import { PromoCodeBlock } from "@/components/PromoCodeBlock";
import { DownloadButtons } from "@/components/DownloadButtons";
import { TestimonialMarquee } from "@/components/TestimonialMarquee";
import { VideoSection } from "@/components/VideoSection";
import { ImportantNotice } from "@/components/ImportantNotice";
import { FinalCta } from "@/components/FinalCta";
import { StickyMiniCta } from "@/components/StickyMiniCta";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PROMO_CODE } from "@/config/site";

const APPLIED_COUNT = parseInt(process.env.NEXT_PUBLIC_APPLIED_COUNT ?? "12000", 10);
const ENABLE_COPY_TRACKING = (process.env.NEXT_PUBLIC_ENABLE_COPY_TRACKING ?? "") === "1";

export default function Page() {
  return (
    <div className="min-h-screen hero-pattern bg-black text-white selection:bg-blue-500/30">
      {/* Mesh Background */}
      <div className="mesh-bg opacity-40" />
      <div className="noise-overlay opacity-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-white/10 shadow-sm">
        <div className="mx-auto max-w-[1120px] px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">FIBONACCI GOAT</span>
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Méthode Certifiée</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Admin Link */}
            <a 
              href="/admin" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
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

      <main className="relative z-10 w-full overflow-x-hidden">
        
        {/* HERO TITLE */}
        <section className="pt-20 pb-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            NOUVELLE STRATÉGIE 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            PRÉCISION, EFFICACITÉ ET <span className="text-blue-500">PROFITS</span> <br className="hidden md:block" />
            AVEC FIBONACCI GOAT
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            La méthode qui change la donne. Regardez les résultats ci-dessous avant de nous rejoindre.
          </p>
        </section>

        {/* HERO SLIDER (MARQUEE) */}
        <TestimonialMarquee />

        {/* VIDEO SECTION */}
        <VideoSection />
        
        <div className="max-w-[1120px] mx-auto px-4 pb-32">
          
          {/* PROMO CODE SECTION */}
          <section id="promo-code" className="py-12">
            <PromoCodeBlock 
              sectionId="promo-code" 
              code={PROMO_CODE} 
              enableTracking={ENABLE_COPY_TRACKING} 
            />
          </section>

          {/* DOWNLOAD SECTION (1XBET) */}
          <section
            aria-label="Téléchargement et inscription"
            id="download"
            className="grid gap-8 lg:grid-cols-2 bg-gradient-to-br from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 mt-8 relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>

            <div className="relative z-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-4">Télécharge l'application <br /><span className="text-blue-500">1xBet</span> Maintenant</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Pour appliquer la méthode Fibonacci Goat, tu as besoin de l'application officielle. 
                Clique ci-dessous pour télécharger la version sécurisée et commencer à gagner.
              </p>
              
              <DownloadButtons 
                microcopy="Lien direct et sécurisé vers le site officiel"
              />

              <div className="flex items-center gap-4 mt-8 pt-8 border-t border-zinc-800/50">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-zinc-400">
                       {i}
                     </div>
                   ))}
                </div>
                <p className="text-xs text-zinc-500">Rejoins +{APPLIED_COUNT} membres actifs</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center">
               {/* Mockup or Illustration */}
               <div className="relative w-64 h-[500px] bg-zinc-900 rounded-[3rem] border-8 border-zinc-800 shadow-2xl overflow-hidden">
                 <div className="absolute top-0 inset-x-0 h-8 bg-zinc-800 rounded-b-xl z-20"></div>
                 <div className="w-full h-full bg-gradient-to-br from-blue-900 to-black flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/50">
                        <span className="text-2xl font-bold text-white">1X</span>
                      </div>
                      <h3 className="text-white font-bold text-xl mb-1">1xBet</h3>
                      <p className="text-blue-300 text-sm">Official App</p>
                      
                      <div className="mt-8 space-y-3">
                         <div className="h-2 w-full bg-zinc-700/50 rounded-full overflow-hidden">
                           <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                         </div>
                         <p className="text-[10px] text-zinc-500">Téléchargement en cours...</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </section>

          {/* FINAL STEPS */}
          <section className="mt-20 space-y-6 max-w-3xl mx-auto">
            <ImportantNotice promoCode={PROMO_CODE} />
            <FinalCta promoCode={PROMO_CODE} />
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-16 py-12 border-t border-zinc-900 bg-black">
          <div className="max-w-[1120px] mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">F</div>
              <span className="text-xl font-bold text-white">FIBONACCI GOAT</span>
            </div>
            <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto">
              La stratégie de trading la plus performante de l'année. Rejoins l'élite dès maintenant.
            </p>
            <div className="flex justify-center gap-6 mb-8">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Termes</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Fibonacci Goat. Tous droits réservés. <br />
              Ce site n'est pas affilié à Facebook ou 1xBet de manière officielle. 
            </p>
          </div>
        </footer>
      </main>

      {/* Sticky Mini CTA */}
      <StickyMiniCta href="#download" label="Télécharger l'App" action="Go" />
      
      {/* Social Proof Toast Notifications */}
      {/* <SocialProofToast />  -- Optional, keep if desired */}
    </div>
  );
}
