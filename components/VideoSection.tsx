"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getPlatformEmbedUrl, isDirectVideoSource } from "@/lib/video";

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  date: string | Date;
  rating?: number;
  imageUrl?: string | null;
}

interface VideoSectionProps {
  videos?: Video[];
  testimonials?: Testimonial[];
}

// Internal Video Card Component
// Internal Video Card Component
// Internal Video Card Component
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
function VideoCard({ video, spanFull }: { video: Video; spanFull?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Helper to extract ID for thumbnail fallback
  const getYTId = (url: string) => {
    try {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    } catch(e: unknown) { console.error(e); return null; }
  };

  const ytId = getYTId(video.url);
  // Initial thumb
  const initialThumb = video.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "/assets/poster.jpg");
  const [thumbSrc, setThumbSrc] = useState(initialThumb);
  const [hasError, setHasError] = useState(false);
  const embedUrl = getPlatformEmbedUrl(video.url);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-zinc-800 bg-zinc-950 group ${
        spanFull ? "aspect-video" : "aspect-[4/3] md:aspect-video"
      }`}
    >
      {!isPlaying ? (
        <button
          type="button"
          className="absolute inset-0 z-10 w-full h-full text-left"
          onClick={() => setIsPlaying(true)}
          aria-label={`Lire: ${video.title}`}
        >
          <img
            src={thumbSrc}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => {
              if (thumbSrc !== "/assets/poster.jpg") setThumbSrc("/assets/poster.jpg");
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/25 to-black/10 hover:from-black/50 transition-colors">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600/95 flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <div className="absolute inset-0 bg-black">
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 p-4 text-center">
              <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm font-medium">Vidéo indisponible</p>
              <p className="text-xs opacity-70 mt-1">Le fichier source est inaccessible</p>
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="mt-4 px-4 py-2 bg-zinc-800 rounded-lg text-xs hover:bg-zinc-700"
              >
                Retour
              </button>
            </div>
          ) : isDirectVideoSource(video.url) ? (
            <video
              src={video.url}
              className="w-full h-full object-contain"
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              onError={() => setHasError(true)}
            />
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              title={video.title}
              onError={() => setHasError(true)}
            />
          ) : (
            <ReactPlayer
              src={video.url}
              width="100%"
              height="100%"
              controls
              playing
              muted
              playsInline
              onError={() => setHasError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function VideoSection({ videos = [], testimonials = [] }: VideoSectionProps) {
  // ... (Layout logic remains same)
  const getVideoLayout = () => {
    if (videos.length === 0) return "";
    if (videos.length === 1) return "flex justify-center";
    if (videos.length === 2) return "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8";
    // Keep cards large enough for readability.
    return "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8";
  };

  // No limit on testimonials, allow grid to wrap
  const displayTestimonials = testimonials;
  
  const getTestimonialLayout = () => {
     if (displayTestimonials.length === 0) return "";
     if (displayTestimonials.length === 1) return "flex justify-center";
     if (displayTestimonials.length === 2) return "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto";
     return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6";
  };

  const hasVideos = videos.length > 0;
  const hasTestimonials = displayTestimonials.length > 0;

  if (!hasVideos && !hasTestimonials) return null;

  const toDateLabel = (value: string | Date) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Récemment";
    return date.toLocaleDateString("fr-FR");
  };

  const normalizeRating = (value?: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) return 5;
    return Math.min(5, Math.max(1, Math.round(value)));
  };

  return (
    <section className="py-[clamp(2.5rem,8vw,5rem)] px-3 min-[430px]:px-4 sm:px-5 max-w-7xl mx-auto">
      {hasVideos && (
        <>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-heading font-serif text-white mb-4">
              Comprendre la methode et <span className="text-blue-500">passer a l&apos;action</span>
            </h2>
            <p className="text-zinc-400 text-sm min-[380px]:text-base max-w-2xl mx-auto">
              Regardez chaque video, appliquez chaque etape, et avancez avec une strategie lisible du debut a la fin.
            </p>
          </div>

          <div className={`${hasTestimonials ? "mb-14 sm:mb-24" : "mb-0"} ${getVideoLayout()}`}>
            {videos.map((video) => (
              <div key={video.id} className={videos.length === 1 ? "w-full max-w-4xl" : "w-full"}>
                <VideoCard video={video} spanFull={videos.length === 1} />
                <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-white text-center">{video.title}</h3>
              </div>
            ))}
          </div>
        </>
      )}

      {hasTestimonials && (
        <>
          <div className="text-center mt-12 sm:mt-24 md:mt-32 mb-8 sm:mb-12">
            <h2 className="section-heading font-serif text-white mb-4">
              Retours d&apos;experience <span className="text-blue-500">verifies</span>
            </h2>
            <p className="text-zinc-400 text-sm min-[380px]:text-base max-w-2xl mx-auto">
              Ces captures et commentaires montrent des cas reels. Vous voyez ce qui fonctionne avant de vous lancer.
            </p>
          </div>

          <div className={getTestimonialLayout()}>
            {displayTestimonials.map((item) => {
              const testimonialRating = normalizeRating(item.rating);

              return (
                <div key={item.id} className={`flex flex-col bg-zinc-900/50 border border-zinc-800 p-4 sm:p-6 rounded-2xl hover:border-blue-500/30 transition-colors shadow-lg ${displayTestimonials.length === 1 ? "max-w-xl w-full" : ""}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg leading-tight">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <span>{toDateLabel(item.date)}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span className="text-blue-400 font-medium uppercase tracking-wider text-[10px]">Vérifié</span>
                      </div>
                    </div>
                  </div>

                  {item.imageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-zinc-700 bg-black aspect-[4/5] relative group cursor-pointer">
                      <img
                        src={item.imageUrl}
                        alt="Preuve de gain"
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm transition-opacity">
                          Voir la preuve
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="relative flex-grow">
                    <p className="text-zinc-300 text-sm leading-relaxed italic pl-2 border-l-2 border-blue-500/30">
                      &quot;{item.text}&quot;
                    </p>
                  </div>

                  <div className="mt-4 flex gap-1 justify-end opacity-80 pt-4 border-t border-white/5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={`${item.id}-${star}`} className={`w-4 h-4 ${star <= testimonialRating ? "text-yellow-500" : "text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
