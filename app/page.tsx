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
import { Arrow3D } from "@/components/Arrow3D";
// LiveNotifications removed
import { WhatsAppScreenshot } from "@/components/WhatsAppScreenshot";
import { VerificationComments } from "@/components/StaticComments";
import { TestimonialForm } from "@/components/TestimonialForm";
import { getHomeContent } from "@/lib/publicContent";
import { TranslateToEnglishButton } from "@/components/TranslateToEnglishButton";
import Image from "next/image";


const APPLIED_COUNT = parseInt(process.env.NEXT_PUBLIC_APPLIED_COUNT ?? "15000", 10);
const ENABLE_COPY_TRACKING = (process.env.NEXT_PUBLIC_ENABLE_COPY_TRACKING ?? "1") === "1";



import { FloatingNotifications } from "@/components/FloatingNotifications";

export default async function Page() {
  const {
    testimonials,
    videos,
    screenshots,
    promoCode: PROMO_CODE,
    tutorialVideoId,
    memberAvatars,
  } = await getHomeContent();

  const serializedTestimonials = testimonials.map((t) => ({
    ...t,
    imageUrl: t.imageUrl || null,
  }));

  const serializedVideos = videos.map((v) => ({
    ...v,
    thumbnailUrl: v.thumbnailUrl || null,
  }));

  const serializedScreenshots = screenshots.map((s) => ({
    ...s,
    imageUrl: s.imageUrl || null,
  }));

  const testimonialsWithoutImage = serializedTestimonials
    .filter((testimonial) => !testimonial.imageUrl)
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  const testimonialsWithImage = serializedTestimonials
    .filter((testimonial) => Boolean(testimonial.imageUrl))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  const tutorialVideo =
    serializedVideos.find((v) => v.id === tutorialVideoId) ??
    serializedVideos.find(
      (v) =>
        v.title.toLowerCase().includes("tutoriel") ||
        v.title.toLowerCase().includes("inscription") ||
        v.title.toLowerCase().includes("tutorial")
    );

  const showcaseVideos = tutorialVideo
    ? serializedVideos.filter((video) => video.id !== tutorialVideo.id)
    : serializedVideos;
  const safeMemberAvatars = Array.isArray(memberAvatars) ? memberAvatars : [];
  const heroMemberPhotos = Array.from({ length: 5 }, (_, index) => {
    return safeMemberAvatars[index] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${index + 21}`;
  });

  return (
    <div className="min-h-screen hero-pattern bg-black text-white selection:bg-blue-500/30 font-sans">
      <FloatingNotifications />
      {/* Mesh Background */}
      <div className="mesh-bg opacity-30" />
      <div className="noise-overlay opacity-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10 shadow-lg">
        <div className="mx-auto max-w-7xl px-2.5 min-[430px]:px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
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
              <span className="font-bold text-white text-sm min-[380px]:text-base sm:text-lg tracking-tight leading-none">MÉTHODE CERTIFIÉE</span>
              <p className="hidden min-[380px]:block text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Validée par +{APPLIED_COUNT}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <TranslateToEnglishButton
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold text-zinc-200 transition-colors hover:border-blue-400/50 hover:text-blue-200"
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full overflow-x-hidden">
        
        {/* HERO SECTION */}
        <section className="pt-[clamp(1.2rem,3.4vw,2.3rem)] pb-[clamp(2.1rem,5vw,3.4rem)] text-center md:text-left px-3 min-[430px]:px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-[clamp(1.75rem,6vw,3rem)] items-center">
             
             {/* Text Content */}
             <div className="relative z-10 isolate">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-[9px] min-[380px]:text-[10px] sm:text-xs text-blue-400 font-bold mb-5 sm:mb-7 uppercase tracking-widest hover:bg-blue-900/40 transition-colors cursor-default">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Mise a jour terrain • 2026
                </div>
                
                <LiveVisitorCount />
                
                <h1 className="hero-title font-serif font-black mb-4 sm:mb-6 relative z-10 overflow-hidden">
                  <div className="flex flex-col items-center md:items-start w-full gap-y-2 sm:gap-y-3 px-1">
                    <div className="flex items-center justify-center md:justify-start w-full gap-x-2 sm:gap-x-3 md:gap-x-4">
                      <Arrow3D
                        color="white"
                        direction="right"
                        className="w-8 h-8 min-[430px]:w-10 min-[430px]:h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 drop-shadow-[0_0_18px_rgba(255,255,255,0.35)] order-first"
                      />
                      <span className="min-w-0 text-white drop-shadow-xl">
                        Ce que pensent nos utilisateurs
                      </span>
                    </div>

                    <div className="flex items-center justify-center md:justify-start w-full gap-x-2 sm:gap-x-3 md:gap-x-4">
                      <span className="min-w-0 text-blue-500 drop-shadow-[0_0_18px_rgba(59,130,246,0.35)]">
                        apres avoir teste la methode
                      </span>
                      <Arrow3D
                        color="blue"
                        direction="right"
                        className="w-8 h-8 min-[430px]:w-10 min-[430px]:h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 drop-shadow-[0_0_22px_rgba(59,130,246,0.6)]"
                      />
                    </div>
                  </div>
                </h1>
                
                <p className="text-[clamp(0.98rem,3.5vw,1.25rem)] text-zinc-400 max-w-xl mb-5 sm:mb-6 leading-relaxed max-[430px]:px-1">
                    Chaque jour, des utilisateurs appliquent la methode Apple of Fortune sur 1xbet. Vous suivez un plan clair, vous evitez les erreurs de debutant et vous avancez avec une logique de resultat.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center md:justify-start">
                    <div className="flex items-center -space-x-3">
                    {heroMemberPhotos.map((photoUrl, index) => (
                        <div key={photoUrl + index} className="w-12 h-12 min-[380px]:w-14 min-[380px]:h-14 sm:w-16 sm:h-16 rounded-full border-4 border-black bg-zinc-800 overflow-hidden relative" style={{ zIndex: 10 - index }}>
                        <Image
                          src={photoUrl}
                          alt="Membre"
                          fill
                          sizes="(max-width: 640px) 56px, 64px"
                          className="object-cover"
                        />
                        </div>
                    ))}
                    <div className="w-12 h-12 min-[380px]:w-14 min-[380px]:h-14 sm:w-16 sm:h-16 rounded-full border-4 border-black bg-blue-600 flex items-center justify-center text-white text-xs min-[380px]:text-sm font-bold">
                        +15k
                    </div>
                    </div>
                    <div className="text-center sm:text-left">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xl">★★★★★</span>
                        <span className="text-white font-bold ml-1">4.9/5</span>
                    </div>
                    <p className="text-sm text-zinc-500">Avis verifies de la communaute</p>
                    </div>
                </div>
             </div>

             {/* Phone / Screenshot Mockup */}
             <div className="relative flex justify-center md:justify-end mt-2 md:mt-0">
                {/* Glow behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] bg-blue-600/30 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="relative animate-float duration-[8000ms]">
                   <WhatsAppScreenshot 
                       className="scale-[0.92] sm:scale-100 rotate-[-4deg] sm:rotate-[-6deg] hover:rotate-0 transition-transform duration-500"
                       name="Suivi Apple of Fortune"
                       message="Execution du plan du jour validee ✅"
                       time="11:30"
                       amount="1,500,000 XAF"
                       type="win"
                       showName={false}
                   />
                </div>
             </div>
          </div>
        </section>

        {/* MARQUEE TESTIMONIALS (First Reassurance Layer) */}
        <section className="py-[clamp(1.25rem,4vw,2rem)] border-y border-white/5 bg-black/50">
           <div className="max-w-7xl mx-auto px-3 min-[430px]:px-4 mb-5 sm:mb-6">
             <h3 className="text-left text-sm font-semibold text-zinc-500 uppercase tracking-widest">
               Retours recents des utilisateurs
             </h3>
           </div>
           <TestimonialMarquee testimonials={testimonialsWithoutImage} screenshots={serializedScreenshots} />
           <VerificationComments comments={testimonialsWithoutImage} />
           <TestimonialForm />
        </section>


        {/* TUTORIAL SECTION */}
        <RegistrationTutorial 
          videoUrl={tutorialVideo?.url}
        />

        {/* VIDEO SECTION (Visual Proof) */}
        <section className="py-[clamp(2.5rem,7vw,5rem)] bg-zinc-950">
           <VideoSection videos={showcaseVideos} testimonials={testimonialsWithImage} />
        </section>
        


        <div className="max-w-7xl mx-auto px-3 min-[430px]:px-4 pb-[clamp(3rem,10vw,8rem)]">
          
          {/* PROMO CODE SECTION */}
          <section id="promo-code" className="py-[clamp(2rem,7vw,4rem)]">
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
            className="grid gap-7 lg:gap-10 lg:grid-cols-2 bg-gradient-to-br from-zinc-900 to-black p-4 sm:p-8 lg:p-12 rounded-[1.4rem] sm:rounded-[2.5rem] border border-white/10 mt-8 sm:mt-12 relative overflow-hidden group"
          >
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -mt-32 -mr-32 group-hover:bg-blue-600/30 transition-all duration-1000"></div>

            <div className="relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-5 sm:mb-6">
                 <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold flex items-center gap-2 border border-blue-500/20">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                   Application Officielle 1Xbet
                 </span>
              </div>
              <h2 className="section-heading font-serif font-bold text-white mb-5 sm:mb-6">
                Telechargez l&apos;application 1Xbet pour <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">demarrer avec une methode claire</span>
              </h2>
              <p className="text-zinc-400 mb-8 sm:mb-10 leading-relaxed text-[clamp(0.95rem,3.4vw,1.12rem)] max-w-md">
                Accedez aux etapes, aux videos et aux mises a jour en temps reel. L&apos;application vous donne le bon cadre pour appliquer la methode sans confusion.
              </p>
              
              <DownloadButtons 
                microcopy="Disponible gratuitement sur iOS et Android"
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/5">
                <p className="text-sm text-zinc-500 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Installation verifiee
                </p>
                <p className="text-sm text-zinc-500 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Demarrage rapide
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center lg:justify-end">
               {/* Generic App Mockup */}
               <div className="relative w-[min(78vw,18rem)] h-[min(138vw,34rem)] sm:w-72 sm:h-[580px] bg-zinc-950 rounded-[2.2rem] sm:rounded-[3rem] border-8 border-zinc-900 shadow-2xl overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-700">
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
                       <h3 className="text-white font-bold text-xl normal-case font-sans">App Mobile</h3>
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
                    
                    <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 px-6 sm:px-8">
                       <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20">Installer</button>
                    </div>
                 </div>
               </div>
            </div>
          </section>

          {/* FINAL CTA Section */}
          <section className="mt-[clamp(2.5rem,8vw,6rem)] max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <ImportantNotice promoCode={PROMO_CODE} />
            <FinalCta promoCode={PROMO_CODE} title="Telecharger l'application 1xbet" />
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-[clamp(2.5rem,8vw,5rem)] py-[clamp(2rem,6vw,3rem)] border-t border-white/5 bg-black safe-bottom-spacing">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
            
            <div className="mb-8">
              <span className="font-bold text-2xl text-white tracking-widest">MÉTHODE<span className="text-blue-500">.</span></span>
            </div>
            
            <div className="grid grid-cols-2 min-[380px]:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-10 sm:mb-12 text-sm text-zinc-500">
               <a href="#" className="hover:text-blue-400 transition-colors">Accueil</a>
               <a href="#download" className="hover:text-blue-400 transition-colors">Application 1xbet</a>
               <a href="#promo-code" className="hover:text-blue-400 transition-colors">Code Promo</a>
               <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
            </div>

            <p className="text-xs text-zinc-600 max-w-lg leading-relaxed">
              © {new Date().getFullYear()} Méthode Certifiée. Tous droits réservés. <br />
              Le contenu de ce site est à titre informatif uniquement. Les jeux d&apos;argent comportent des risques. Jouez de manière responsable.
            </p>
          </div>
        </footer>
        {/* LiveNotifications removed here */}
      </main>

      {/* Sticky Mini CTA */}
      <StickyMiniCta href="#download" label="Obtenir l&apos;App 1xbet" action="Ouvrir" />
      
    </div>
  );
}
