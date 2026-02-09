import { PromoCodeBlock } from "@/components/PromoCodeBlock";
import { DownloadButtons } from "@/components/DownloadButtons";
import { TestimonialMarquee } from "@/components/TestimonialMarquee";
import { VideoSection } from "@/components/VideoSection";
import { ImportantNotice } from "@/components/ImportantNotice";
import { FinalCta } from "@/components/FinalCta";
import { StickyMiniCta } from "@/components/StickyMiniCta";
import { ThemeToggle } from "@/components/ThemeToggle";
// import { TestimonialGrid } from "@/components/TestimonialGrid";
import { RegistrationTutorial } from "@/components/RegistrationTutorial";
import { LiveVisitorCount } from "@/components/LiveVisitorCount";

import { getActiveTestimonials, getActiveVideos, getPromoCode, getActiveScreenshots } from "@/lib/data";
// LiveNotifications removed
import { WhatsAppScreenshot } from "@/components/WhatsAppScreenshot";
import { VerificationComments } from "@/components/StaticComments";
import { TestimonialForm } from "@/components/TestimonialForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const APPLIED_COUNT = parseInt(process.env.NEXT_PUBLIC_APPLIED_COUNT ?? "15000", 10);
const ENABLE_COPY_TRACKING = (process.env.NEXT_PUBLIC_ENABLE_COPY_TRACKING ?? "") === "1";



import { PageTracker } from "@/components/PageTracker";
import { FloatingNotifications } from "@/components/FloatingNotifications";
import { FloatingSocialProof } from "@/components/FloatingSocialProof";

export default async function Page() {
  const testimonials = await getActiveTestimonials();
  const videos = await getActiveVideos();
  const screenshots = await getActiveScreenshots();
  const PROMO_CODE = await getPromoCode();

  const serializedTestimonials = testimonials.map(t => ({
    ...t,
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    imageUrl: t.imageUrl || null
  }));

  const serializedVideos = videos.map(v => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
    thumbnailUrl: v.thumbnailUrl || null
  }));

  const serializedScreenshots = screenshots.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    imageUrl: s.imageUrl || null
  }));

  const tutorialVideo = serializedVideos.find(v => 
    v.title.toLowerCase().includes("tutoriel") || 
    v.title.toLowerCase().includes("inscription") ||
    v.title.toLowerCase().includes("tutorial")
  );

  return (
    <div className="min-h-screen hero-pattern bg-black text-white selection:bg-blue-500/30 font-sans">
      <PageTracker />
      <FloatingNotifications />
      {/* Mesh Background */}
      <div className="mesh-bg opacity-30" />
      <div className="noise-overlay opacity-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">MÉTHODE CERTIFIÉE</span>
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Validée par +{APPLIED_COUNT}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full overflow-x-hidden">
        
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 text-center md:text-left px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             
             {/* Text Content */}
             <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest hover:bg-blue-900/40 transition-colors cursor-default">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Nouvelle Mise à Jour 2026
                </div>
                
                <LiveVisitorCount />
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight drop-shadow-2xl">
                    <span className="text-white">👇 Ce que disent les utilisateurs</span>
                    <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 animate-gradient-x text-glow-blue">
                         après avoir testé cette méthode.
                    </span>
                    <span className="text-yellow-400 sepia-0 ml-2 shadow-yellow-500/50 drop-shadow-md">👇</span>
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
                    Rejoignez une communauté de gagnants. Nos méthodes sont testées, approuvées et mises à jour quotidiennement pour garantir votre succès.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                    <div className="flex items-center -space-x-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-zinc-800 overflow-hidden relative z-[10-i]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} alt="Membre" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-4 border-black bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        +15k
                    </div>
                    </div>
                    <div className="text-left">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xl">★★★★★</span>
                        <span className="text-white font-bold ml-1">4.9/5</span>
                    </div>
                    <p className="text-sm text-zinc-500">Note moyenne de nos membres</p>
                    </div>
                </div>
             </div>

             {/* Phone / Screenshot Mockup */}
             <div className="relative flex justify-center md:justify-end">
                {/* Glow behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/30 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="relative animate-float duration-[8000ms]">
                   <WhatsAppScreenshot 
                       className="rotate-[-6deg] hover:rotate-0 transition-transform duration-500"
                       name="Coach Pronos"
                       message="Voilà pour aujourd'hui ! C'est validé ✅"
                       time="11:30"
                       amount="1,500,000 XAF"
                   />
                </div>
             </div>
          </div>
        </section>

        {/* MARQUEE TESTIMONIALS (First Reassurance Layer) */}
        <section className="py-8 border-y border-white/5 bg-black/50">
           <div className="max-w-7xl mx-auto px-4 mb-6">
             <h3 className="text-left text-sm font-semibold text-zinc-500 uppercase tracking-widest">
               Ce que disent nos membres
             </h3>
           </div>
           <TestimonialMarquee testimonials={serializedTestimonials} screenshots={serializedScreenshots} />
           <VerificationComments />
           <TestimonialForm />
        </section>


        {/* TUTORIAL SECTION */}
        <RegistrationTutorial 
          videoUrl={tutorialVideo?.url}
          videoThumbnail={tutorialVideo?.thumbnailUrl}
        />

        {/* VIDEO SECTION (Visual Proof) */}
        <section className="py-20 bg-zinc-950">
           <VideoSection videos={serializedVideos} testimonials={serializedTestimonials} />
        </section>
        


        <div className="max-w-7xl mx-auto px-4 pb-32">
          
          {/* PROMO CODE SECTION */}
          <section id="promo-code" className="py-16">
            <PromoCodeBlock 
              sectionId="promo-code" 
              code={PROMO_CODE} 
              enableTracking={ENABLE_COPY_TRACKING} 
            />
          </section>

          {/* DOWNLOAD SECTION (Generic Store Links) */}
          <section
            aria-label="Téléchargement"
            id="download"
            className="grid gap-10 lg:grid-cols-2 bg-gradient-to-br from-zinc-900 to-black p-8 sm:p-12 rounded-[2.5rem] border border-white/10 mt-12 relative overflow-hidden group"
          >
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -mt-32 -mr-32 group-hover:bg-blue-600/30 transition-all duration-1000"></div>

            <div className="relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-6">
                 <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold flex items-center gap-2 border border-blue-500/20">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                   Application Officielle
                 </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Téléchargez pour <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Commencer Maintenant</span>
              </h2>
              <p className="text-zinc-400 mb-10 leading-relaxed text-lg max-w-md">
                Accédez à toutes les astuces, suivez les mises à jour en temps réel et sécurisez vos gains. L'application est indispensable pour appliquer la méthode.
              </p>
              
              <DownloadButtons 
                microcopy="Disponible gratuitement sur iOS et Android"
              />

              <div className="flex items-center gap-4 mt-10 pt-8 border-t border-white/5">
                <p className="text-sm text-zinc-500 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Vérifié sans virus
                </p>
                <p className="text-sm text-zinc-500 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Téléchargement rapide
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center lg:justify-end">
               {/* Generic App Mockup */}
               <div className="relative w-72 h-[580px] bg-zinc-950 rounded-[3rem] border-8 border-zinc-900 shadow-2xl overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-700">
                 <div className="absolute top-0 inset-x-0 h-8 bg-zinc-900 rounded-b-xl z-20 flex justify-center pt-2">
                    <div className="w-20 h-1.5 bg-zinc-800 rounded-full"></div>
                 </div>
                 <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black flex flex-col items-center justify-center p-6 relative">
                    {/* Abstract App UI */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl shadow-blue-500/20 flex items-center justify-center">
                       <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                    </div>
                    <div className="text-center">
                       <h3 className="text-white font-bold text-xl">App Mobile</h3>
                       <p className="text-blue-400 text-sm">Version 2.0</p>
                    </div>
                    
                    <div className="mt-12 w-full space-y-4">
                       <div className="h-12 w-full bg-zinc-800/50 rounded-xl flex items-center px-4 gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20"></div>
                          <div className="h-2 w-24 bg-zinc-700 rounded-full"></div>
                       </div>
                       <div className="h-12 w-full bg-zinc-800/50 rounded-xl flex items-center px-4 gap-3 opacity-60">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20"></div>
                          <div className="h-2 w-32 bg-zinc-700 rounded-full"></div>
                       </div>
                    </div>
                    
                    <div className="absolute bottom-10 left-0 right-0 px-8">
                       <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20">Installer</button>
                    </div>
                 </div>
               </div>
            </div>
          </section>

          {/* FINAL CTA Section */}
          <section className="mt-24 max-w-3xl mx-auto space-y-8">
            <ImportantNotice promoCode={PROMO_CODE} />
            <FinalCta promoCode={PROMO_CODE} />
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-20 py-12 border-t border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
            
            <div className="mb-8">
              <span className="font-bold text-2xl text-white tracking-widest">MÉTHODE<span className="text-blue-500">.</span></span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm text-zinc-500">
               <a href="#" className="hover:text-blue-400 transition-colors">Accueil</a>
               <a href="#download" className="hover:text-blue-400 transition-colors">Application</a>
               <a href="#promo-code" className="hover:text-blue-400 transition-colors">Code Promo</a>
               <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
            </div>

            <p className="text-xs text-zinc-600 max-w-lg leading-relaxed">
              © {new Date().getFullYear()} Méthode Certifiée. Tous droits réservés. <br />
              Le contenu de ce site est à titre informatif uniquement. Les jeux d'argent comportent des risques. Jouez de manière responsable.
            </p>
          </div>
        </footer>
        {/* LiveNotifications removed here */}
      </main>

      {/* Sticky Mini CTA */}
      <StickyMiniCta href="#download" label="Obtenir l'App" action="Go" />
      
    </div>
  );
}
