"use client";

import Image from "next/image";
import { testimonials } from "@/data/testimonials";

export function TestimonialMarquee() {
  // Duplicate testimonials to ensure smooth infinite scrolling
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="w-full overflow-hidden bg-black py-10 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      
      <div className="flex animate-scroll hover:pause">
        {allTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-shrink-0 w-[240px] md:w-[280px] mx-3"
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-zinc-800 shadow-lg group">
              {testimonial.imageUrl ? (
                <Image
                  src={testimonial.imageUrl}
                  alt={`Témoignage de ${testimonial.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center p-4">
                  <p className="text-zinc-500 text-sm text-center italic">
                    "{testimonial.text}"
                  </p>
                </div>
              )}
              
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-12">
                <p className="text-white font-bold text-sm">{testimonial.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <p className="text-xs text-zinc-300">Résultat validé</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .hover\:pause:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
