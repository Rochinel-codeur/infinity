import type { Testimonial } from "@/data/testimonials";
import { TestimonialMiniCard } from "@/components/TestimonialMiniCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export function TestimonialsAboveFold({
  facebookHint,
  appliedCount,
  testimonials,
  hideHeader = false
}: {
  facebookHint: string;
  appliedCount: number;
  testimonials: Testimonial[];
  hideHeader?: boolean;
}) {
  const items = testimonials.slice(0, 3);

  return (
    <section aria-label="Témoignages" className="space-y-5">
      {!hideHeader && (
        <>
          {/* Badges de confiance */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-medium text-zinc-700 dark:text-zinc-200">Retours WhatsApp</span>
            </div>
            
            <div className="badge-success rounded-full px-4 py-2 text-sm font-semibold">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Déjà{" "}
                <AnimatedCounter end={appliedCount} duration={2500} className="font-bold" />
                {" "}personnes l&apos;ont appliquée
              </span>
            </div>
          </div>

          {/* Titre principal */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              <span className="text-zinc-900 dark:text-zinc-50">Méthode simple et </span>
              <span className="gradient-text">déjà testée</span>
              <span className="text-zinc-900 dark:text-zinc-50"> :</span>
              <br />
              <span className="text-zinc-900 dark:text-zinc-50">tu es </span>
              <span className="gradient-text-gold">au bon endroit.</span>
            </h1>
          </div>

          {/* Sous-titre */}
          <p 
            className="text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            {facebookHint}
          </p>
        </>
      )}

      {/* Grille de témoignages */}
      <div
        className="glass-card rounded-2xl p-3 sm:p-4 shadow-soft animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
        tabIndex={0}
        role="region"
        aria-label="Avis utilisateurs (défilement horizontal)"
      >
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Témoignages vérifiés
          </span>
        </div>
        
        <ul className="flex snap-x snap-mandatory gap-3 sm:gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible scrollbar-hide">
          {items.map((t, index) => (
            <li
              key={t.id}
              className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-auto"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <TestimonialMiniCard testimonial={t} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
