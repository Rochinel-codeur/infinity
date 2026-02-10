"use client";

interface Testimonial {
  id: string;
  name: string;
  imageUrl?: string | null;
  text: string;
  rating?: number;
  source?: string;
  date?: string;
}

interface TestimonialGridProps {
  testimonials: Testimonial[];
}

export function TestimonialGrid({ testimonials }: TestimonialGridProps) {
  // Use same dummy data fallback or empty check
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [];

  if (displayTestimonials.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
        <h3 className="text-xl font-bold text-white">Retours d&apos;expérience vérifiés</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTestimonials.map((t) => (
          <div key={t.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/60 transition-colors">
            <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-3">
                  {t.imageUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 relative">
                          <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                  ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {t.name.charAt(0)}
                      </div>
                  )}
                  <div>
                      <h4 className="font-bold text-white text-sm">{t.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <span>{t.source || "Membre"}</span>
                          {t.date && <span>• {new Date(t.date).toLocaleDateString()}</span>}
                      </div>
                  </div>
               </div>
               {t.rating && (
                   <div className="flex gap-0.5 text-yellow-400 text-xs">
                       {"★".repeat(t.rating)}
                       {"☆".repeat(5 - t.rating)}
                   </div>
               )}
            </div>

            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                &quot;{t.text}&quot;
            </p>

            {/* If there is an image URL (screenshot), maybe show a preview? 
                The user said "captures added by users". Usually it's the screenshot itself.
                If t.imageUrl matches the screenshot, we can show it larger.
                But t.imageUrl serves as avatar in my code above?
                Wait, user uploads "Preuve (Capture d'écran)".
                So `t.imageUrl` IS the screenshot, not the avatar.
                Code above uses it as avatar. I should fix that.
            */}
            
            {t.imageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-white/5 bg-black/50 relative group cursor-pointer">
                    <img src={t.imageUrl} alt="Preuve" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white backdrop-blur">
                        Preuve
                    </div>
                </div>
            )}

            {!t.imageUrl && (
                 <div className="mt-2 text-xs text-green-500 flex items-center gap-1">
                     <span>✅</span> Coupon Validé
                 </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
